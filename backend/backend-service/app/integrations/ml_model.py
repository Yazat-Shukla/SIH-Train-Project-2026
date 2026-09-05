from typing import Any


MODEL_VERSION = "baseline-v1"


def _baseline_score(task: dict[str, Any]) -> float:
    """
    Calculate the BlackFire priority score using the baseline model.

    Factors:
    - Criticality: 30%
    - Severity: 25%
    - Asset importance: 20%
    - Train impact: 10%
    - Overdue score: 10%
    - Historical failures: 5%
    """

    criticality = float(task.get("criticality", 0))
    severity = float(task.get("severity", 0))
    asset_importance = float(task.get("asset_importance", 0))
    train_impact = float(task.get("train_impact", 0))
    overdue_days = float(task.get("overdue_days", 0))
    historical_failures = float(task.get("historical_failures", 0))

    # Convert overdue days into a 0-10 score.
    overdue_score = min(overdue_days / 3.0, 10.0)

    # Cap historical failures at 10.
    failure_score = min(historical_failures, 10.0)

    score = (
        criticality * 0.30
        + severity * 0.25
        + asset_importance * 0.20
        + train_impact * 0.10
        + overdue_score * 0.10
        + failure_score * 0.05
    )

    return round(score * 10.0, 2)


def _priority_level(score: float) -> str:
    """Convert numerical priority score into a priority level."""

    if score >= 80:
        return "CRITICAL"

    if score >= 60:
        return "HIGH"

    if score >= 40:
        return "MEDIUM"

    return "LOW"


def predict_priority(tasks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Predict priority scores for maintenance tasks.

    The function accepts dictionaries produced by priority_service.py
    and returns prediction dictionaries.
    """

    predictions = []

    for task in tasks:
        score = _baseline_score(task)

        predictions.append(
            {
                "task_id": task["task_id"],
                "priority_score": score,
                "priority_level": _priority_level(score),
                "model_version": MODEL_VERSION,
            }
        )

    return predictions
