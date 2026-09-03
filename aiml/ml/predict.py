import pandas as pd

from ml.baseline import calculate_priority_with_level


def predict_priorities(tasks):
    """
    Calculate priority scores for a list of maintenance tasks.
    """

    results = []

    for task in tasks:
        task_copy = task.copy()

        result = calculate_priority_with_level(task_copy)

        task_copy["priority_score"] = result["priority_score"]
        task_copy["priority_level"] = result["priority_level"]

        results.append(task_copy)

    # Highest priority first
    results.sort(
        key=lambda task: task["priority_score"],
        reverse=True
    )

    return results


def load_tasks_from_csv(file_path):
    """
    Load maintenance tasks from a CSV file.
    """

    df = pd.read_csv(file_path)

    # Convert dataframe rows into dictionaries
    tasks = df.to_dict(orient="records")

    return tasks


if __name__ == "__main__":

    csv_path = "ml/data/sample_tasks.csv"

    tasks = load_tasks_from_csv(csv_path)

    prioritized = predict_priorities(tasks)

    print("\nAI Priority Results")
    print("-" * 60)

    for task in prioritized:
        print(
            f"{task['task_id']} | "
            f"{task['department']} | "
            f"{task['priority_score']} | "
            f"{task['priority_level']}"
        )