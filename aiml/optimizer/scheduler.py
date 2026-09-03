import json

from ortools.sat.python import cp_model

from optimizer.constraints import interval_to_minutes
from optimizer.objective import build_priority_objective


def generate_schedule(
    tasks,
    blocks,
    trains,
    planning_start="22:00"
):
    """
    Generate an optimized maintenance schedule.

    Constraints:
    1. Task must fit inside its maintenance block.
    2. Task corridor must match block corridor.
    3. Task must not overlap with trains on the same corridor.
    4. Tasks assigned to the same block must not overlap.

    Objective:
    Maximize total priority score of scheduled tasks.
    """

    model = cp_model.CpModel()

    task_variables = []

    # ---------------------------------------------------------
    # CREATE VARIABLES FOR EACH TASK
    # ---------------------------------------------------------

    for task in tasks:

        task_id = task["task_id"]
        duration = int(task["duration_minutes"])
        corridor = task["corridor_id"]
        priority = float(task["priority_score"])

        compatible_blocks = []

        for block in blocks:

            if block["corridor_id"] != corridor:
                continue

            block_start, block_end = interval_to_minutes(
                block["start_time"],
                block["end_time"],
                planning_start
            )

            if duration > (block_end - block_start):
                continue

            compatible_blocks.append(
                (
                    block,
                    block_start,
                    block_end
                )
            )

        if not compatible_blocks:
            continue

        block_choices = []

        for (
            block,
            block_start,
            block_end
        ) in compatible_blocks:

            block_id = block["block_id"]

            start_var = model.NewIntVar(
                block_start,
                block_end - duration,
                f"start_{task_id}_{block_id}"
            )

            end_var = model.NewIntVar(
                block_start + duration,
                block_end,
                f"end_{task_id}_{block_id}"
            )

            selected_var = model.NewBoolVar(
                f"selected_{task_id}_{block_id}"
            )

            model.Add(
                end_var == start_var + duration
            ).OnlyEnforceIf(selected_var)

            # -------------------------------------------------
            # TRAIN CONFLICT CONSTRAINT
            # -------------------------------------------------

            for train in trains:

                if train["corridor_id"] != corridor:
                    continue

                train_start, train_end = interval_to_minutes(
                    train["start_time"],
                    train["end_time"],
                    planning_start
                )

                before_train = model.NewBoolVar(
                    f"before_{task_id}_{block_id}_{train['train_id']}"
                )

                after_train = model.NewBoolVar(
                    f"after_{task_id}_{block_id}_{train['train_id']}"
                )

                # Task finishes before train
                model.Add(
                    end_var <= train_start
                ).OnlyEnforceIf(before_train)

                # Task starts after train
                model.Add(
                    start_var >= train_end
                ).OnlyEnforceIf(after_train)

                # If task is selected, it must be either
                # before OR after the train.
                model.AddBoolOr(
                    [
                        before_train,
                        after_train,
                        selected_var.Not()
                    ]
                )

            block_choices.append(
                (
                    selected_var,
                    start_var,
                    end_var,
                    block,
                    block_start,
                    block_end
                )
            )

        # A task can be assigned to at most one block
        model.Add(
            sum(
                choice[0]
                for choice in block_choices
            ) <= 1
        )

        task_variables.append(
            {
                "task": task,
                "choices": block_choices,
                "priority": priority
            }
        )

    # ---------------------------------------------------------
    # SAME-BLOCK TASK OVERLAP CONSTRAINT
    # ---------------------------------------------------------

    for i in range(len(task_variables)):

        for j in range(i + 1, len(task_variables)):

            task_a = task_variables[i]
            task_b = task_variables[j]

            for (
                selected_a,
                start_a,
                end_a,
                block_a,
                _,
                _
            ) in task_a["choices"]:

                for (
                    selected_b,
                    start_b,
                    end_b,
                    block_b,
                    _,
                    _
                ) in task_b["choices"]:

                    if (
                        block_a["block_id"]
                        != block_b["block_id"]
                    ):
                        continue

                    a_before_b = model.NewBoolVar(
                        f"a_before_b_{i}_{j}_{block_a['block_id']}"
                    )

                    b_before_a = model.NewBoolVar(
                        f"b_before_a_{i}_{j}_{block_a['block_id']}"
                    )

                    model.Add(
                        end_a <= start_b
                    ).OnlyEnforceIf(a_before_b)

                    model.Add(
                        end_b <= start_a
                    ).OnlyEnforceIf(b_before_a)

                    model.AddBoolOr(
                        [
                            a_before_b,
                            b_before_a,
                            selected_a.Not(),
                            selected_b.Not()
                        ]
                    )

    # ---------------------------------------------------------
    # OPTIMIZATION OBJECTIVE
    # ---------------------------------------------------------

    selected_variables = []
    priority_scores = []

    for task_data in task_variables:

        for (
            selected_var,
            _,
            _,
            _,
            _,
            _
        ) in task_data["choices"]:

            selected_variables.append(
                selected_var
            )

            priority_scores.append(
                task_data["priority"]
            )

    build_priority_objective(
        model,
        selected_variables,
        priority_scores
    )

    # ---------------------------------------------------------
    # SOLVE
    # ---------------------------------------------------------

    solver = cp_model.CpSolver()

    solver.parameters.max_time_in_seconds = 10

    status = solver.Solve(model)

    if status not in (
        cp_model.OPTIMAL,
        cp_model.FEASIBLE
    ):
        return {
            "status": "INFEASIBLE",
            "schedule": []
        }

    # ---------------------------------------------------------
    # BUILD RESULT
    # ---------------------------------------------------------

    schedule = []

    for task_data in task_variables:

        task = task_data["task"]

        for (
            selected_var,
            start_var,
            end_var,
            block,
            block_start,
            block_end
        ) in task_data["choices"]:

            if solver.Value(selected_var) == 1:

                start_minutes = solver.Value(
                    start_var
                )

                end_minutes = solver.Value(
                    end_var
                )

                schedule.append(
                    {
                        "task_id": task["task_id"],
                        "department": task["department"],
                        "corridor_id": task["corridor_id"],
                        "block_id": block["block_id"],

                        # Task timing
                        "start_minutes": start_minutes,
                        "end_minutes": end_minutes,

                        # Actual block timing
                        "block_start_minutes": block_start,
                        "block_end_minutes": block_end,

                        "priority_score": task["priority_score"]
                    }
                )

    schedule.sort(
        key=lambda item: item["start_minutes"]
    )

    return {
        "status": (
            "OPTIMAL"
            if status == cp_model.OPTIMAL
            else "FEASIBLE"
        ),
        "schedule": schedule
    }


def minutes_to_time(minutes):
    """
    Convert minutes into HH:MM format.

    Supports times beyond midnight.
    """

    minutes = minutes % (24 * 60)

    hours = minutes // 60
    mins = minutes % 60

    return f"{hours:02d}:{mins:02d}"


def format_schedule(result):
    """
    Convert internal task-based schedule into
    frontend/API-friendly block-based structure.
    """

    if result["status"] == "INFEASIBLE":

        return {
            "status": "INFEASIBLE",
            "blocks": []
        }

    blocks = {}

    for item in result["schedule"]:

        block_id = item["block_id"]

        if block_id not in blocks:

            blocks[block_id] = {
                "block_id": block_id,
                "corridor_id": item["corridor_id"],

                # IMPORTANT:
                # Use actual block timing,
                # NOT first task timing.
                "start_time": minutes_to_time(
                    item["block_start_minutes"]
                ),

                "end_time": minutes_to_time(
                    item["block_end_minutes"]
                ),

                "tasks": []
            }

        blocks[block_id]["tasks"].append(
            {
                "task_id": item["task_id"],
                "department": item["department"],
                "priority": item["priority_score"],
                "start_time": minutes_to_time(
                    item["start_minutes"]
                ),
                "end_time": minutes_to_time(
                    item["end_minutes"]
                )
            }
        )

    return {
        "status": result["status"],
        "blocks": list(blocks.values())
    }


if __name__ == "__main__":

    with open(
        "optimizer/sample_input.json",
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)

    planning_start = data.get(
        "planning_start_time",
        "22:00"
    )

    result = generate_schedule(
        data["tasks"],
        data["blocks"],
        data["trains"],
        planning_start
    )

    print("\nOptimization Result")
    print("=" * 60)

    print(
        "Planning Start:",
        planning_start
    )

    print(
        "Status:",
        result["status"]
    )

    for item in result["schedule"]:

        print(
            f"{item['task_id']} | "
            f"Block {item['block_id']} | "
            f"{minutes_to_time(item['start_minutes'])} - "
            f"{minutes_to_time(item['end_minutes'])} | "
            f"Priority {item['priority_score']}"
        )

    formatted = format_schedule(
        result
    )

    print("\nFrontend/API Schedule")
    print("=" * 60)

    print(
        json.dumps(
            formatted,
            indent=2
        )
    )