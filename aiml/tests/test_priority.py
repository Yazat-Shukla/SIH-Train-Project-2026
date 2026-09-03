from ml.baseline import (
    calculate_priority,
    get_priority_level,
)


def test_priority_score():
    task = {
        "criticality": 10,
        "severity": 9,
        "asset_importance": 10,
        "train_impact": 8,
        "overdue_days": 6,
        "historical_failures": 3,
    }

    score = calculate_priority(task)

    assert score == 84.0


def test_priority_level():
    assert get_priority_level(90) == "CRITICAL"
    assert get_priority_level(70) == "HIGH"
    assert get_priority_level(50) == "MEDIUM"
    assert get_priority_level(20) == "LOW"