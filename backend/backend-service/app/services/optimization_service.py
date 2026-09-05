from datetime import date, datetime, time, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import (
    MaintenanceBlock,
    MaintenanceTask,
    PlanningRun,
    ScheduleAssignment,
    ScheduleConflict,
    TaskPriorityPrediction,
    Train,
)
from app.db.database import get_db
from aiml.ai_engine import run_ai_engine


MODEL_VERSION = "baseline-v1"


def _task_to_dict(task: MaintenanceTask) -> dict:
    return {
        "task_id": task.task_id,
        "corridor_id": task.corridor_id,
        "task_type": task.task_type,
        "description": task.description,
        "criticality": float(task.criticality),
        "severity": float(task.severity),
        "asset_importance": float(task.asset_importance),
        "train_impact": float(task.train_impact),
        "overdue_days": int(task.overdue_days),
        "historical_failures": int(task.historical_failures),
        "duration_minutes": int(task.duration_minutes),
        "due_date": (
            task.due_date.isoformat()
            if task.due_date
            else None
        ),
        "status": task.status,
    }


def _block_to_dict(block: MaintenanceBlock) -> dict:
    return {
        "block_id": block.block_id,
        "corridor_id": block.corridor_id,
        "block_date": block.block_date.isoformat(),
        "start_time": block.start_time.strftime("%H:%M"),
        "end_time": block.end_time.strftime("%H:%M"),
        "status": block.status,
        "description": block.description,
    }


def _train_to_dict(train: Train) -> dict:
    return {
        "train_id": train.train_id,
        "train_number": train.train_number,
        "train_name": train.train_name,
        "corridor_id": train.corridor_id,
        "service_date": train.service_date.isoformat(),
        "start_time": train.start_time.strftime("%H:%M"),
        "end_time": train.end_time.strftime("%H:%M"),
        "train_type": train.train_type,
        "is_active": train.is_active,
    }


def _to_datetime(
    planning_date: date,
    value: str,
    reference_start: time | None = None,
) -> datetime:
    parsed_time = datetime.strptime(value, "%H:%M").time()
    result = datetime.combine(planning_date, parsed_time)

    if reference_start is not None and parsed_time < reference_start:
        result += timedelta(days=1)

    return result


def _save_priorities(
    db: Session,
    priority_results: list[dict],
) -> None:
    for item in priority_results:
        db.add(
            TaskPriorityPrediction(
                task_id=item["task_id"],
                model_version=item.get(
                    "model_version",
                    MODEL_VERSION,
                ),
                priority_score=float(item["priority_score"]),
                priority_level=item["priority_level"],
                predicted_at=datetime.now(),
            )
        )


def _save_assignments(
    db: Session,
    planning_run_id: int,
    planning_date: date,
    schedule: dict,
) -> None:
    for block in schedule.get("blocks", []):
        block_id = block["block_id"]

        for task in block.get("tasks", []):
            start = _to_datetime(
                planning_date,
                task["start_time"],
            )

            end = _to_datetime(
                planning_date,
                task["end_time"],
                start.time(),
            )

            db.add(
                ScheduleAssignment(
                    planning_run_id=planning_run_id,
                    task_id=task["task_id"],
                    block_id=block_id,
                    scheduled_start=start,
                    scheduled_end=end,
                    priority_score=float(
                        task["priority_score"]
                    ),
                    status="SCHEDULED",
                    planner_approved=False,
                    created_at=datetime.now(),
                )
            )


def _save_conflicts(
    db: Session,
    planning_run_id: int,
    unscheduled_tasks: list[dict],
) -> None:
    for item in unscheduled_tasks:
        db.add(
            ScheduleConflict(
                planning_run_id=planning_run_id,
                task_id=item.get("task_id"),
                conflict_type="UNSCHEDULED",
                reason=item.get("reason"),
                resolved=False,
                created_at=datetime.now(),
            )
        )


def generate_planning(
    db: Session,
    planning_date: date,
    created_by: str,
) -> dict:
    """
    Generate and persist an optimized maintenance plan.

    Flow:
        PostgreSQL
        -> AIML priority engine
        -> OR-Tools scheduler
        -> PlanningRun
        -> Priority predictions
        -> Schedule assignments
        -> Schedule conflicts
    """

    tasks = list(
        db.scalars(
            select(MaintenanceTask).where(
                MaintenanceTask.status.in_(
                    ["PENDING", "IN_PROGRESS"]
                )
            )
        ).all()
    )

    blocks = list(
        db.scalars(
            select(MaintenanceBlock).where(
                MaintenanceBlock.block_date == planning_date,
                MaintenanceBlock.status == "AVAILABLE",
            )
        ).all()
    )

    trains = list(
        db.scalars(
            select(Train).where(
                Train.service_date.in_(
                    [
                        planning_date,
                        planning_date + timedelta(days=1),
                    ]
                ),
                Train.is_active.is_(True),
            )
        ).all()
    )

    planning_start = min(
        (block.start_time for block in blocks),
        default=time(22, 0),
    )

    planning_end = max(
        (block.end_time for block in blocks),
        default=time(0, 0),
    )

    ai_input = {
        "planning_start_time": planning_start.strftime("%H:%M"),
        "tasks": [
            _task_to_dict(task)
            for task in tasks
        ],
        "blocks": [
            _block_to_dict(block)
            for block in blocks
        ],
        "trains": [
            _train_to_dict(train)
            for train in trains
        ],
    }

    ai_result = run_ai_engine(ai_input)

    priority_results = ai_result.get(
        "priority_results",
        [],
    )

    schedule = ai_result.get(
        "schedule",
        {},
    )

    unscheduled_tasks = ai_result.get(
        "unscheduled_tasks",
        [],
    )

    planning_run = PlanningRun(
        planning_date=planning_date,
        planning_start_time=planning_start,
        planning_end_time=planning_end,
        status=ai_result.get(
            "status",
            "UNKNOWN",
        ),
        model_version=MODEL_VERSION,
        created_at=datetime.now(),
        created_by=created_by,
    )

    db.add(planning_run)
    db.flush()

    _save_priorities(
        db,
        priority_results,
    )

    _save_assignments(
        db,
        planning_run.planning_run_id,
        planning_date,
        schedule,
    )

    _save_conflicts(
        db,
        planning_run.planning_run_id,
        unscheduled_tasks,
    )

    db.commit()
    db.refresh(planning_run)

    return {
        "planning_run_id": planning_run.planning_run_id,
        "planning_date": planning_date,
        "created_by": created_by,
        "status": planning_run.status,
        "model_version": planning_run.model_version,
        "tasks_considered": len(tasks),
        "blocks_available": len(blocks),
        "trains_considered": len(trains),
        "priority_results": priority_results,
        "schedule": schedule,
        "unscheduled_tasks": unscheduled_tasks,
    }


generate_plan = generate_planning
