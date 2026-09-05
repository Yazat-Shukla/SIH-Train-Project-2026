from datetime import date, time, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import (
    MaintenanceBlock,
    MaintenanceTask,
    Train,
)
from app.services.priority_service import (
    calculate_priorities,
    save_priorities,
)
from app.services.schedule_service import build_schedule


def generate_planning(
    db: Session,
    planning_date: date,
    created_by: str,
) -> dict:
    """
    Generate an optimized maintenance plan for a given date.

    Current architecture:
        MaintenanceTask
        MaintenanceBlock
        Train
        TaskPriorityPrediction

    The service intentionally does not depend on:
        GoodsTrainForecast
        PlanningRun
        ScheduleConflict
    because those models are not present in the current project.
    """

    # ---------------------------------------------------------
    # 1. Fetch active maintenance tasks
    # ---------------------------------------------------------

    tasks = list(
        db.scalars(
            select(MaintenanceTask).where(
                MaintenanceTask.status.in_(
                    ["PENDING", "IN_PROGRESS"]
                )
            )
        ).all()
    )

    # ---------------------------------------------------------
    # 2. Fetch available maintenance blocks
    # ---------------------------------------------------------

    blocks = list(
        db.scalars(
            select(MaintenanceBlock).where(
                MaintenanceBlock.block_date == planning_date,
                MaintenanceBlock.status == "AVAILABLE",
            )
        ).all()
    )

    # ---------------------------------------------------------
    # 3. Fetch trains for planning date
    # ---------------------------------------------------------

    trains = list(
        db.scalars(
            select(Train).where(
                Train.service_date.in_(
                    [
                        planning_date,
                        planning_date + timedelta(days=1),
                    ]
                )
            )
        ).all()
    )

    # ---------------------------------------------------------
    # 4. Calculate task priorities
    # ---------------------------------------------------------

    priorities = calculate_priorities(db)

    priority_map = {
        item["task_id"]: item
        for item in priorities
    }

    # Save predictions if priority service supports it.
    save_priorities(db, priorities)

    # ---------------------------------------------------------
    # 5. Run scheduler
    # ---------------------------------------------------------

    optimized = build_schedule(
        tasks=tasks,
        blocks=blocks,
        trains=trains,
        forecasts=[],
        priorities=priority_map,
    )

    assignments = optimized.get(
        "assignments",
        []
    )

    conflicts = optimized.get(
        "conflicts",
        []
    )

    # ---------------------------------------------------------
    # 6. Return planning result
    # ---------------------------------------------------------

    planning_start_time = min(
        (
            block.start_time
            for block in blocks
        ),
        default=time(0, 0),
    )

    planning_end_time = max(
        (
            block.end_time
            for block in blocks
        ),
        default=time(0, 0),
    )

    return {
        "planning_date": planning_date,
        "created_by": created_by,
        "planning_start_time": planning_start_time,
        "planning_end_time": planning_end_time,
        "status": "COMPLETED",
        "tasks_considered": len(tasks),
        "blocks_available": len(blocks),
        "trains_considered": len(trains),
        "assignments": assignments,
        "conflicts": conflicts,
    }

# Backward-compatible alias
generate_plan = generate_planning