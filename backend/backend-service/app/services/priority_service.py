from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import MaintenanceTask
from aiml.ml.predict import predict_priorities


def get_tasks_for_priority(
    db: Session,
) -> list[MaintenanceTask]:
    return list(
        db.scalars(
            select(MaintenanceTask)
        ).all()
    )


def prepare_priority_features(
    tasks: list[MaintenanceTask],
) -> list[dict]:
    features = []

    for task in tasks:
        features.append(
            {
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
                "status": task.status,
            }
        )

    return features


def calculate_priorities(
    db: Session,
) -> list[dict]:
    tasks = get_tasks_for_priority(db)

    if not tasks:
        return []

    features = prepare_priority_features(tasks)
    predictions = predict_priorities(features)

    return [
        {
            "task_id": item["task_id"],
            "priority_score": item["priority_score"],
            "priority_level": item["priority_level"],
            "model_version": "baseline-v1",
        }
        for item in predictions
    ]
