from datetime import datetime, timedelta

from app.integrations.optimizer import generate_schedule


def build_schedule(tasks, blocks, trains, forecasts, priorities):
    return generate_schedule(
        tasks=tasks,
        blocks=blocks,
        trains=trains,
        forecasts=forecasts,
        priorities=priorities,
    )
