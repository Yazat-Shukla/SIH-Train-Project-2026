import json
from pathlib import Path

from aiml.ml.predict import predict_priorities
from aiml.optimizer.constraints import interval_to_minutes
from aiml.optimizer.scheduler import (
    generate_schedule,
    minutes_to_time,
    format_schedule,
)


BASE_DIR = Path(__file__).resolve().parents[1]
SAMPLE_FILE = BASE_DIR / "optimizer" / "sample_input.json"


def load_sample_data():
    with open(
        SAMPLE_FILE,
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

            a_start, a_end = interval_to_minutes(
                task_a["start_time"],
                task_a["end_time"],
                "22:00",
            )

            b_start, b_end = interval_to_minutes(
                task_b["start_time"],
                task_b["end_time"],
                "22:00",
            )

            overlap = (
                a_start < b_end
                and b_start < a_end
            )

            assert not overlap


def test_tasks_stay_inside_blocks():
    data, result = get_optimized_result()

    blocks = {
        block["block_id"]: block
        for block in data["blocks"]
    }

    for item in result["schedule"]:

        block = blocks[item["block_id"]]

        task_start, task_end = interval_to_minutes(
            item["start_time"],
            item["end_time"],
            "22:00",
        )

        block_start, block_end = interval_to_minutes(
            block["start_time"],
            block["end_time"],
            "22:00",
        )

        assert task_start >= block_start
        assert task_end <= block_end


def test_formatted_schedule_has_correct_block_times():
    _, result = get_optimized_result()

    formatted = format_schedule(result)

    b22 = next(
        block
        for block in formatted["blocks"]
        if block["block_id"] == "B22"
    )

    assert b22["corridor_id"] == "C02"


def test_minutes_to_time_handles_midnight():

    assert minutes_to_time(1320) == "22:00"
    assert minutes_to_time(1440) == "00:00"
    assert minutes_to_time(1470) == "00:30"
    assert minutes_to_time(1500) == "01:00"

def test_ai_engine_interface():
    from aiml.ai_engine import run_ai_engine

    data = load_sample_data()

    result = run_ai_engine(data)

    assert result["status"] == "OPTIMAL"
    assert "priority_results" in result
    assert "schedule" in result
    assert "unscheduled_tasks" in result
    assert len(result["priority_results"]) == len(data["tasks"])