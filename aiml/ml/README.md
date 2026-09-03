\# BlackFire AI/ML Module



This module handles maintenance task priority scoring for the BlackFire railway maintenance planning system.



\## Purpose



The AI module takes maintenance task information and produces:



\- Priority score from 0 to 100

\- Priority level

\- Ranked maintenance tasks



The priority result is then passed to the optimization engine.



\## Priority Levels



| Score | Level |

|---|---|

| 80-100 | CRITICAL |

| 60-79.99 | HIGH |

| 40-59.99 | MEDIUM |

| 0-39.99 | LOW |



\## Input Features



The current priority scoring uses:



\- `criticality`

\- `severity`

\- `asset\_importance`

\- `train\_impact`

\- `overdue\_days`

\- `historical\_failures`



These factors are combined into a weighted priority score.



\## Current Implementation



The current implementation uses a transparent weighted baseline.



This is intentional because a real supervised ML model such as XGBoost requires reliable historical labels. Until such labelled railway maintenance data is available, the weighted baseline provides an explainable and deterministic priority score.



\## Main Functions



\### `calculate\_priority(task)`



Calculates the priority score.



\### `get\_priority\_level(score)`



Converts the score into:



\- LOW

\- MEDIUM

\- HIGH

\- CRITICAL



\### `predict\_priorities(tasks)`



Calculates priority for all tasks and sorts them from highest to lowest priority.



\### `run\_ai\_engine(data)`



Main integration interface.



```python

from ai\_engine import run\_ai\_engine



result = run\_ai\_engine(data)

