import json

from aiml.ml.predict import predict_priorities
from aiml.optimizer.scheduler import generate_schedule, format_schedule
from aiml.optimizer.constraints import (
    interval_to_minutes,
    find_block_gaps,
)


def minutes_to_time(minutes):
    minutes = minutes % (24 * 60)
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"


def explain_unscheduled_task(task, blocks, trains, planning_start):
    """
    Find a human-readable reason why a task could not be scheduled.
    """

    task_id = task["task_id"]
    corridor_id = task["corridor_id"]
    duration = int(task["duration_minutes"])

    matching_blocks = [
        block
        for block in blocks
        if block["corridor_id"] == corridor_id
    ]

    if not matching_blocks:
        return (
            f"No maintenance block is available for corridor "
            f"{corridor_id}."
        )

    max_available_gap = 0

    for block in matching_blocks:
        gaps = find_block_gaps(
            block,
            trains,
            planning_start,
        )

        for gap_start, gap_end in gaps:
            gap_duration = gap_end - gap_start

            max_available_gap = max(
                max_available_gap,
                gap_duration,
            )

            if gap_duration >= duration:
                return (
                    f"A {duration}-minute maintenance window "
                    f"is available in block {block['block_id']} "
                    f"from {minutes_to_time(gap_start)} to "
                    f"{minutes_to_time(gap_end)}."
                )

    return (
        f"No continuous {duration}-minute window is available "
        f"on corridor {corridor_id}. "
        f"Maximum available gap is {max_available_gap} minutes "
        f"because of train conflicts."
    )


def run_pipeline(data):
    tasks = data["tasks"]
    blocks = data["blocks"]
    trains = data["trains"]

    planning_start = data.get(
        "planning_start_time",
        "22:00"
    )

    # Step 1: AI priority scoring
    prioritized_tasks = predict_priorities(tasks)

    # Step 2: Optimization
    optimization_result = generate_schedule(
        prioritized_tasks,
        blocks,
        trains,
        planning_start,
    )

    # Step 3: Frontend-friendly schedule
    formatted_schedule = format_schedule(
        optimization_result
    )

    # Step 4: Identify scheduled tasks
    scheduled_task_ids = {
        task["task_id"]
        for block in formatted_schedule["blocks"]
        for task in block["tasks"]
    }

    # Step 5: Explain unscheduled tasks
    unscheduled_tasks = []

    for task in prioritized_tasks:
        if task["task_id"] not in scheduled_task_ids:
            reason = explain_unscheduled_task(
                task,
                blocks,
                trains,
                planning_start,
            )

            unscheduled_tasks.append(
                {
                    "task_id": task["task_id"],
                    "priority_score": task["priority_score"],
                    "priority_level": task["priority_level"],
                    "corridor_id": task["corridor_id"],
                    "duration_minutes": task["duration_minutes"],
                    "reason": reason,
                }
            )

    return {
        "status": formatted_schedule["status"],
        "priority_results": prioritized_tasks,
        "schedule": formatted_schedule,
        "unscheduled_tasks": unscheduled_tasks,
    }


if __name__ == "__main__":
    with open(
        "aiml/optimizer/sample_input.json",
        "r",
        encoding="utf-8"
    ) as file:
        data = json.load(file)

    result = run_pipeline(data)

    print("\nBLACKFIRE AI PIPELINE")
    print("=" * 60)

    print("\nPriority Results")
    print("-" * 60)

    for task in result["priority_results"]:
        print(
            f"{task['task_id']} | "
            f"Priority: {task['priority_score']} | "
            f"Level: {task['priority_level']}"
        )

    print("\nOptimized Schedule")
    print("-" * 60)

    print(
        json.dumps(
            result["schedule"],
            indent=2
        )
    )

    print("\nUnscheduled Tasks")
    print("-" * 60)

    if result["unscheduled_tasks"]:
        for task in result["unscheduled_tasks"]:
            print(
                f"{task['task_id']} | "
                f"Priority: {task['priority_score']} | "
                f"Level: {task['priority_level']}"
            )
            print(
                f"Reason: {task['reason']}"
            )
            print()
    else:
        print("None")