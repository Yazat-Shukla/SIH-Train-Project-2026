MINUTES_PER_DAY = 24 * 60


def time_to_minutes(time_str):
    hours, minutes = map(int, time_str.split(":"))
    return hours * 60 + minutes


def to_horizon_minutes(time_str, planning_start="22:00"):
    time_minutes = time_to_minutes(time_str)
    start_minutes = time_to_minutes(planning_start)

    if time_minutes < start_minutes:
        time_minutes += MINUTES_PER_DAY

    return time_minutes


def interval_to_minutes(
    start_time,
    end_time,
    planning_start="22:00"
):
    start = to_horizon_minutes(start_time, planning_start)
    end = to_horizon_minutes(end_time, planning_start)

    if end <= start:
        end += MINUTES_PER_DAY

    return start, end


def intervals_overlap(
    start1,
    end1,
    start2,
    end2
):
    return start1 < end2 and start2 < end1


def task_fits_block(
    task_duration,
    block_start,
    block_end
):
    return task_duration <= (block_end - block_start)


def find_block_gaps(
    block,
    trains,
    planning_start="22:00"
):
    """
    Find continuous available time gaps inside a maintenance block
    after excluding train windows on the same corridor.

    Returns:
        List of tuples:
        [(start_minutes, end_minutes), ...]
    """

    block_start, block_end = interval_to_minutes(
        block["start_time"],
        block["end_time"],
        planning_start
    )

    train_intervals = []

    for train in trains:
        # Train on another corridor does not affect this block
        if train["corridor_id"] != block["corridor_id"]:
            continue

        train_start, train_end = interval_to_minutes(
            train["start_time"],
            train["end_time"],
            planning_start
        )

        # Consider only train windows that overlap the block
        if intervals_overlap(
            block_start,
            block_end,
            train_start,
            train_end
        ):
            train_intervals.append(
                (
                    max(block_start, train_start),
                    min(block_end, train_end)
                )
            )

    # No conflicting trains
    if not train_intervals:
        return [(block_start, block_end)]

    # Sort train windows chronologically
    train_intervals.sort()

    gaps = []
    current = block_start

    for train_start, train_end in train_intervals:

        if current < train_start:
            gaps.append(
                (current, train_start)
            )

        current = max(
            current,
            train_end
        )

    # Gap after the final train
    if current < block_end:
        gaps.append(
            (current, block_end)
        )

    return gaps