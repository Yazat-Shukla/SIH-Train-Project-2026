from collections.abc import Sequence


def _baseline_score(task) -> float:
    # Temporary adapter until Person 3 supplies the trained XGBoost artifact.
    score = (
        float(task.criticality) * 0.30
        + float(task.severity) * 0.25
        + float(task.asset_importance) * 0.20
        + float(task.train_impact) * 0.15
        + min(float(task.overdue_days), 10.0) * 0.05
        + min(float(task.historical_failures), 10.0) * 0.05
    ) * 10.0
    return round(max(0.0, min(100.0, score)), 2)


def predict_priority(tasks: Sequence) -> list[dict]:
    results = []
    for task in tasks:
        score = _baseline_score(task)
        if score >= 80:
            level = "CRITICAL"
        elif score >= 60:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"

        results.append({
            "task_id": task.task_id,
            "priority_score": score,
            "priority_level": level,
            "model_version": "baseline-v1",
        })
    return results