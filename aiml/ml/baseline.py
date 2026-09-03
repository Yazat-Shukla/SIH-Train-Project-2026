def calculate_priority(task):
    """
    Calculate maintenance priority score from 0 to 100.

    Expected input fields:
        criticality: 0-10
        severity: 0-10
        asset_importance: 0-10
        train_impact: 0-10
        overdue_days: number of days
        historical_failures: number of previous failures
    """

    criticality = max(0, min(float(task.get("criticality", 0)), 10))
    severity = max(0, min(float(task.get("severity", 0)), 10))
    asset_importance = max(0, min(float(task.get("asset_importance", 0)), 10))
    train_impact = max(0, min(float(task.get("train_impact", 0)), 10))

    overdue_days = max(0, float(task.get("overdue_days", 0)))
    historical_failures = max(0, float(task.get("historical_failures", 0)))

    # Normalize capped values to 0-10
    overdue_score = min(overdue_days / 3, 10)
    failure_score = min(historical_failures, 10)

    score = (
        criticality * 0.30
        + severity * 0.25
        + asset_importance * 0.20
        + train_impact * 0.10
        + overdue_score * 0.10
        + failure_score * 0.05
    )

    return round(score * 10, 2)


def get_priority_level(score):
    """
    Convert numerical priority score into a risk/priority level.
    """

    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    else:
        return "LOW"


def calculate_priority_with_level(task):
    """
    Return both priority score and priority level.
    """

    score = calculate_priority(task)

    return {
        "priority_score": score,
        "priority_level": get_priority_level(score),
    }


if __name__ == "__main__":
    sample_task = {
        "task_id": "ENG-104",
        "criticality": 10,
        "severity": 9,
        "asset_importance": 10,
        "train_impact": 8,
        "overdue_days": 6,
        "historical_failures": 3,
    }

    result = calculate_priority_with_level(sample_task)

    print("Task:", sample_task["task_id"])
    print("Priority Score:", result["priority_score"])
    print("Priority Level:", result["priority_level"])