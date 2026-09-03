import json

from ml.predict import predict_priorities
from optimizer.constraints import interval_to_minutes
from optimizer.scheduler import (
    generate_schedule,
    minutes_to_time,
    format_schedule,
)


def load_sample_data():
    with open(
        "optimizer/sample_input.json",
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def get_optimized_result():
    data = load_sample_data()

    prioritized_tasks = predict_priorities(
        data["tasks"]
    )

    result = generate_schedule(
        prioritized_tasks,
        data["blocks"],
        data["trains"],
        data.get("planning_start_time", "22:00"),
    )

    return data, result


def test_overnight_time_conversion():
    start, end = interval_to_minutes(
        "23:30",
        "00:30",
        "22:00",
    )

    assert start == 1410
    assert end == 1470


def test_train_time_conversion():
    start, end = interval_to_minutes(
        "00:15",
        "00:45",
        "22:00",
    )

    assert start == 1455
    assert end == 1485


def test_schedule_is_optimal():
    _, result = get_optimized_result()

    assert result["status"] == "OPTIMAL"


def test_scheduled_tasks_do_not_overlap():
    _, result = get_optimized_result()

    schedule = result["schedule"]

    for i in range(len(schedule)):
        for j in range(i + 1, len(schedule)):

            task_a = schedule[i]
            task_b = schedule[j]

            if task_a["block_id"] != task_b["block_id"]:
                continue

            overlap = (
                task_a["start_minutes"]
                < task_b["end_minutes"]
                and
                task_b["start_minutes"]
                < task_a["end_minutes"]
            )

            assert not overlap


def test_tasks_stay_inside_blocks():
    _, result = get_optimized_result()

    for item in result["schedule"]:

        assert (
            item["start_minutes"]
            >= item["block_start_minutes"]
        )

        assert (
            item["end_minutes"]
            <= item["block_end_minutes"]
        )


def test_formatted_schedule_has_correct_block_times():
    _, result = get_optimized_result()

    formatted = format_schedule(result)

    b22 = next(
        block
        for block in formatted["blocks"]
        if block["block_id"] == "B22"
    )

    assert b22["start_time"] == "22:00"
    assert b22["end_time"] == "01:00"


def test_minutes_to_time_handles_midnight():

    assert minutes_to_time(1320) == "22:00"
    assert minutes_to_time(1440) == "00:00"
    assert minutes_to_time(1470) == "00:30"
    assert minutes_to_time(1500) == "01:00"