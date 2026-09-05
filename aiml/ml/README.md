# BlackFire AI/ML Module

This module provides the AI-based maintenance task prioritization and optimization components for the BlackFire railway maintenance planning system.

## Purpose

The AIML module performs two main functions:

1. **Maintenance Priority Scoring**
   - Calculates a priority score from 0 to 100.
   - Assigns a priority level.
   - Ranks maintenance tasks by priority.

2. **Maintenance Block Optimization**
   - Uses OR-Tools to schedule prioritized maintenance tasks.
   - Considers maintenance block availability.
   - Prevents maintenance work from overlapping with train movements.
   - Prevents maintenance tasks from overlapping with each other.
   - Identifies tasks that could not be scheduled and explains why.

## AI Priority Engine

The current production priority engine uses a transparent weighted baseline.

The score is calculated using:

- `criticality`
- `severity`
- `asset_importance`
- `train_impact`
- `overdue_days`
- `historical_failures`

The weighted factors produce a score between 0 and 100.

This approach is intentional because a supervised ML model such as XGBoost requires reliable historical labelled railway maintenance data.

## Priority Levels

| Score | Level |
|---|---|
| 80-100 | CRITICAL |
| 60-79.99 | HIGH |
| 40-59.99 | MEDIUM |
| 0-39.99 | LOW |

## Optimization Engine

The optimization engine uses Google OR-Tools CP-SAT.

The optimizer considers:

- Maintenance task duration
- Maintenance block availability
- Corridor compatibility
- Train movement windows
- Task-to-task overlap
- Maximum available maintenance windows
- Priority score

The objective is to maximize the total priority value of scheduled maintenance tasks while satisfying the scheduling constraints.

## Unscheduled Task Explanation

If a task cannot be scheduled, the pipeline provides an explanation.

For example:

> No continuous 120-minute window is available on corridor C01. Maximum available gap is 75 minutes because of train conflicts.

This makes the scheduling result explainable to planners instead of simply marking a task as unsuccessful.

## ML Experiment

An XGBoost model is included in:

`train_maintenance_model.py`

It is used as an ML experiment/benchmark on the available predictive-maintenance dataset.

The experiment evaluates:

- Accuracy
- Precision
- Recall
- F1 Score
- Classification Report
- Confusion Matrix

The XGBoost model is not currently used as the production priority engine because the available dataset does not provide sufficiently reliable evidence for replacing the transparent priority baseline.

## Main Functions

### `calculate_priority(task)`

Calculates the maintenance priority score.

### `get_priority_level(score)`

Converts the priority score into:

- LOW
- MEDIUM
- HIGH
- CRITICAL

### `predict_priorities(tasks)`

Calculates priority for all maintenance tasks and sorts them from highest to lowest priority.

### `generate_schedule(tasks, blocks, trains)`

Uses OR-Tools to generate an optimized maintenance schedule.

### `run_ai_engine(data)`

Main integration interface for the backend.

Example:

```python
from aiml.ai_engine import run_ai_engine

result = run_ai_engine(data)