import pandas as pd

from aiml.ml.baseline import calculate_priority_with_level


def predict_priorities(tasks):
    prioritized_tasks = []

    for task in tasks:
        task_copy = task.copy()

        result = calculate_priority_with_level(task_copy)

        if isinstance(result, tuple):
            score, level = result
        elif isinstance(result, dict):
            score = result["priority_score"]
            level = result["priority_level"]
        else:
            score = float(result)

            if score >= 80:
                level = "CRITICAL"
            elif score >= 60:
                level = "HIGH"
            elif score >= 40:
                level = "MEDIUM"
            else:
                level = "LOW"

        task_copy["priority_score"] = float(score)
        task_copy["priority_level"] = level

        prioritized_tasks.append(task_copy)

    prioritized_tasks.sort(
        key=lambda task: task["priority_score"],
        reverse=True,
    )

    return prioritized_tasks


def load_tasks_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    return df.to_dict(orient="records")