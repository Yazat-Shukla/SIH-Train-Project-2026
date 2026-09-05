from aiml.pipeline import run_pipeline

def run_ai_engine(data):
    """
    Main AI + Optimization interface.

    Input:
        data = {
            "planning_start_time": "...",
            "tasks": [...],
            "blocks": [...],
            "trains": [...]
        }

    Output:
        {
            "status": "...",
            "priority_results": [...],
            "schedule": {...},
            "unscheduled_tasks": [...]
        }
    """
    return run_pipeline(data)