from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import MaintenanceTask, TaskPriorityPrediction
from app.integrations.ml_model import predict_priority


def get_tasks_for_priority(db: Session) -> list[MaintenanceTask]:
    """Fetch maintenance tasks for priority prediction."""
    return list(
        db.scalars(
            select(MaintenanceTask)
        ).all()
    )


def prepare_priority_features(
    tasks: list[MaintenanceTask],
) -> list[dict]:
    """Prepare the six priority factors required by the ML model."""

    features = []

    for task in tasks:
        features.append(
            {
                "task_id": task.task_id,
                "criticality": float(task.criticality),
                "severity": float(task.severity),
                "asset_importance": float(task.asset_importance),
                "train_impact": float(task.train_impact),
                "overdue_days": int(task.overdue_days),
                "historical_failures": int(task.historical_failures),
            }
        )

    return features


def calculate_priorities(db: Session) -> list[dict]:
    """Calculate priority predictions for maintenance tasks."""

    tasks = get_tasks_for_priority(db)

    if not tasks:
        return []

    features = prepare_priority_features(tasks)

    predictions = predict_priority(features)

    results = []

    for task, prediction in zip(tasks, predictions, strict=True):
        results.append(
            {
                "task_id": task.task_id,
                "priority_score": prediction["priority_score"],
                "priority_level": prediction["priority_level"],
                "model_version": prediction["model_version"],
            }
        )

    return results


def save_priorities(
    db: Session,
    predictions: list[dict],
) -> None:
    """Save priority predictions to the database."""

    for item in predictions:
        db.add(
            TaskPriorityPrediction(
                task_id=item["task_id"],
                model_version=item["model_version"],
                priority_score=item["priority_score"],
                priority_level=item["priority_level"],
            )
        )

    db.commit()
