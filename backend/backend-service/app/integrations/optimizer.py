from datetime import datetime, timedelta


def _block_window(block):
    start = datetime.combine(block.block_date, block.start_time)
    end = datetime.combine(block.block_date, block.end_time)
    if end <= start:
        end += timedelta(days=1)
    return start, end


def _overlaps(a_start, a_end, b_start, b_end):
    return a_start < b_end and b_start < a_end


def generate_schedule(*, tasks, blocks, trains, forecasts, priorities):
    assignments = []
    conflicts = []
    block_next_start = {}

    sorted_tasks = sorted(
        tasks,
        key=lambda task: priorities.get(task.task_id, {}).get("priority_score", 0),
        reverse=True,
    )

    for task in sorted_tasks:
        candidates = [
            block for block in blocks
            if block.corridor_id == task.corridor_id
        ]

        scheduled = False

        for block in candidates:
            block_start, block_end = _block_window(block)
            cursor = block_next_start.get(block.block_id, block_start)
            task_end = cursor + timedelta(minutes=task.duration_minutes)

            if task_end > block_end:
                continue

            train_conflict = None
            for train in trains:
                if train.corridor_id != block.corridor_id:
                    continue

                train_start = datetime.combine(train.service_date, train.start_time)
                train_end = datetime.combine(train.service_date, train.end_time)
                if train_end <= train_start:
                    train_end += timedelta(days=1)

                if _overlaps(cursor, task_end, train_start, train_end):
                    train_conflict = train
                    break

            if train_conflict:
                continue

            assignments.append({
                "task_id": task.task_id,
                "block_id": block.block_id,
                "scheduled_start": cursor,
                "scheduled_end": task_end,
                "priority_score": priorities.get(task.task_id, {}).get("priority_score", 0),
            })
            block_next_start[block.block_id] = task_end
            scheduled = True
            break

        if not scheduled:
            conflicts.append({
                "task_id": task.task_id,
                "block_id": None,
                "train_id": None,
                "conflict_type": "NO_FEASIBLE_BLOCK",
                "reason": "No compatible available block could fit the task without a train conflict.",
            })

    return {"assignments": assignments, "conflicts": conflicts}