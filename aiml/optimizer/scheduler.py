from ortools.sat.python import cp_model

from aiml.optimizer.constraints import (
    interval_to_minutes,
    task_fits_block,
)


def minutes_to_time(minutes):
    minutes = minutes % (24 * 60)
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"


def generate_schedule(
    tasks,
    blocks,
    trains,
    planning_start="22:00",
):
    """
    Generate an optimized maintenance schedule.

    Constraints:
    1. Task must fit inside its maintenance block.
    2. Task and block must belong to the same corridor.
    3. Task must not overlap a train.
    4. Tasks in the same block must not overlap.
    5. Each task can be scheduled at most once.

    Objective:
    Maximize total priority score of scheduled tasks.
    """

    model = cp_model.CpModel()

    task_variables = []

    # ---------------------------------------------------------
    # Create optional task intervals
    # ---------------------------------------------------------

    for task in tasks:

        task_id = task["task_id"]
        duration = int(task["duration_minutes"])

        for block in blocks:

            if task["corridor_id"] != block["corridor_id"]:
                continue

            block_start, block_end = interval_to_minutes(
                block["start_time"],
                block["end_time"],
                planning_start,
            )

            if not task_fits_block(
                duration,
                block_start,
                block_end,
            ):
                continue

            latest_start = block_end - duration

            start_var = model.NewIntVar(
                block_start,
                latest_start,
                f"start_{task_id}_{block['block_id']}",
            )

            end_var = model.NewIntVar(
                block_start + duration,
                block_end,
                f"end_{task_id}_{block['block_id']}",
            )

            scheduled_var = model.NewBoolVar(
                f"scheduled_{task_id}_{block['block_id']}"
            )

            model.Add(
                end_var == start_var + duration
            )

            interval_var = model.NewOptionalIntervalVar(
                start_var,
                duration,
                end_var,
                scheduled_var,
                f"interval_{task_id}_{block['block_id']}",
            )

            task_variables.append(
                {
                    "task": task,
                    "block": block,
                    "start": start_var,
                    "end": end_var,
                    "scheduled": scheduled_var,
                    "interval": interval_var,
                }
            )

    # ---------------------------------------------------------
    # Each task can be scheduled at most once
    # ---------------------------------------------------------

    for task in tasks:

        task_vars = [
            item["scheduled"]
            for item in task_variables
            if item["task"]["task_id"] == task["task_id"]
        ]

        if task_vars:
            model.AddAtMostOne(task_vars)

    # ---------------------------------------------------------
    # Block-level constraints
    #
    # AddNoOverlap guarantees:
    # - maintenance tasks don't overlap each other
    # - maintenance tasks don't overlap trains
    # ---------------------------------------------------------

    for block in blocks:

        block_items = [
            item
            for item in task_variables
            if item["block"]["block_id"] == block["block_id"]
        ]

        block_intervals = [
            item["interval"]
            for item in block_items
        ]

        # Add fixed train intervals for this corridor
        for train in trains:

            if train["corridor_id"] != block["corridor_id"]:
                continue

            train_start, train_end = interval_to_minutes(
                train["start_time"],
                train["end_time"],
                planning_start,
            )

            # Only add trains that can affect this block
            if train_end <= block_intervals_start(block):
                continue

            if train_start >= block_intervals_end(block):
                continue

            clipped_start = max(
                train_start,
                block_intervals_start(block),
            )

            clipped_end = min(
                train_end,
                block_intervals_end(block),
            )

            if clipped_start >= clipped_end:
                continue

            train_interval = model.NewIntervalVar(
                clipped_start,
                clipped_end - clipped_start,
                clipped_end,
                f"train_{block['block_id']}_{train['train_id']}",
            )

            block_intervals.append(train_interval)

        if block_intervals:
            model.AddNoOverlap(block_intervals)

    # ---------------------------------------------------------
    # Objective: maximize priority
    # ---------------------------------------------------------

    objective_terms = []

    for item in task_variables:

        priority = float(
            item["task"].get(
                "priority_score",
                0,
            )
        )

        priority_integer = int(
            round(priority * 100)
        )

        objective_terms.append(
            priority_integer * item["scheduled"]
        )

    if objective_terms:
        model.Maximize(
            sum(objective_terms)
        )

    # ---------------------------------------------------------
    # Solve
    # ---------------------------------------------------------

    solver = cp_model.CpSolver()

    solver.parameters.max_time_in_seconds = 10

    status = solver.Solve(model)

    schedule = []

    if status in (
        cp_model.OPTIMAL,
        cp_model.FEASIBLE,
    ):

        for item in task_variables:

            if solver.Value(item["scheduled"]) == 1:

                start = solver.Value(
                    item["start"]
                )

                end = solver.Value(
                    item["end"]
                )

                schedule.append(
                    {
                        "task_id": item["task"]["task_id"],
                        "block_id": item["block"]["block_id"],
                        "corridor_id": item["task"]["corridor_id"],
                        "start_time": minutes_to_time(start),
                        "end_time": minutes_to_time(end),
                        "duration_minutes": int(
                            item["task"]["duration_minutes"]
                        ),
                        "priority_score": item["task"].get(
                            "priority_score",
                            0,
                        ),
                        "priority_level": item["task"].get(
                            "priority_level",
                            "",
                        ),
                    }
                )

    schedule.sort(
        key=lambda item: (
            item["block_id"],
            item["start_time"],
        )
    )

    if status == cp_model.OPTIMAL:
        status_text = "OPTIMAL"
    elif status == cp_model.FEASIBLE:
        status_text = "FEASIBLE"
    else:
        status_text = "INFEASIBLE"

    return {
        "status": status_text,
        "schedule": schedule,
    }


def block_intervals_start(block, planning_start="22:00"):
    start, _ = interval_to_minutes(
        block["start_time"],
        block["end_time"],
        planning_start,
    )
    return start


def block_intervals_end(block, planning_start="22:00"):
    _, end = interval_to_minutes(
        block["start_time"],
        block["end_time"],
        planning_start,
    )
    return end


def format_schedule(result):
    """
    Convert optimizer output into frontend-friendly format.
    """

    blocks = {}

    for item in result["schedule"]:

        block_id = item["block_id"]

        if block_id not in blocks:
            blocks[block_id] = {
                "block_id": block_id,
                "corridor_id": item["corridor_id"],
                "tasks": [],
            }

        blocks[block_id]["tasks"].append(
            {
                "task_id": item["task_id"],
                "start_time": item["start_time"],
                "end_time": item["end_time"],
                "duration_minutes": item["duration_minutes"],
                "priority_score": item["priority_score"],
                "priority_level": item["priority_level"],
            }
        )

    return {
        "status": result["status"],
        "blocks": list(blocks.values()),
    }