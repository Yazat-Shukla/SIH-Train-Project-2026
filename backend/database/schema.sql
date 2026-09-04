-- ============================================================
-- BLACKFIRE - DATABASE SCHEMA
-- SIH26027
-- AI-Powered Automatic Block Planning
-- ============================================================

-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);


-- ============================================================
-- 2. CORRIDORS
-- ============================================================

CREATE TABLE corridors (
    corridor_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================================
-- 3. ASSETS
-- ============================================================

CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,

    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    asset_type VARCHAR(50),

    department_id INTEGER NOT NULL
        REFERENCES departments(department_id),

    corridor_id VARCHAR(20) NOT NULL
        REFERENCES corridors(corridor_id),

    location VARCHAR(255),

    importance_score NUMERIC(4,2),

    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',

    commissioned_date DATE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CHECK (importance_score IS NULL OR importance_score BETWEEN 0 AND 10)
);


-- ============================================================
-- 4. MAINTENANCE TASKS
-- ============================================================

CREATE TABLE maintenance_tasks (
    task_id VARCHAR(30) PRIMARY KEY,

    asset_id INTEGER
        REFERENCES assets(asset_id),

    department_id INTEGER NOT NULL
        REFERENCES departments(department_id),

    corridor_id VARCHAR(20) NOT NULL
        REFERENCES corridors(corridor_id),

    task_type VARCHAR(100),

    description TEXT,

    -- Raw inputs used by the AI priority calculation
    criticality NUMERIC(4,2) NOT NULL,
    severity NUMERIC(4,2) NOT NULL,
    asset_importance NUMERIC(4,2) NOT NULL,
    train_impact NUMERIC(4,2) NOT NULL,

    overdue_days INTEGER NOT NULL DEFAULT 0,

    historical_failures INTEGER NOT NULL DEFAULT 0,

    -- Required by the scheduling optimizer
    duration_minutes INTEGER NOT NULL,

    due_date DATE,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (criticality BETWEEN 0 AND 10),
    CHECK (severity BETWEEN 0 AND 10),
    CHECK (asset_importance BETWEEN 0 AND 10),
    CHECK (train_impact BETWEEN 0 AND 10),
    CHECK (overdue_days >= 0),
    CHECK (historical_failures >= 0),
    CHECK (duration_minutes > 0)
);


-- ============================================================
-- 5. MAINTENANCE DEFECTS
-- ============================================================

CREATE TABLE maintenance_defects (
    defect_id BIGSERIAL PRIMARY KEY,

    asset_id INTEGER NOT NULL
        REFERENCES assets(asset_id),

    task_id VARCHAR(30)
        REFERENCES maintenance_tasks(task_id)
        ON DELETE SET NULL,

    defect_type VARCHAR(100) NOT NULL,

    description TEXT,

    severity NUMERIC(4,2),

    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    CHECK (severity IS NULL OR severity BETWEEN 0 AND 10)
);


-- ============================================================
-- 6. TRAINS
-- ============================================================

CREATE TABLE trains (
    train_id VARCHAR(30) PRIMARY KEY,

    train_number VARCHAR(30) NOT NULL,

    train_name VARCHAR(150),

    corridor_id VARCHAR(20) NOT NULL
        REFERENCES corridors(corridor_id),

    service_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    train_type VARCHAR(50),

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);


-- ============================================================
-- 7. MAINTENANCE BLOCKS
-- ============================================================

CREATE TABLE maintenance_blocks (
    block_id VARCHAR(30) PRIMARY KEY,

    corridor_id VARCHAR(20) NOT NULL
        REFERENCES corridors(corridor_id),

    block_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',

    description TEXT
);


-- ============================================================
-- 8. GOODS TRAIN FORECASTS
-- ============================================================

CREATE TABLE goods_train_forecasts (
    forecast_id BIGSERIAL PRIMARY KEY,

    corridor_id VARCHAR(20) NOT NULL
        REFERENCES corridors(corridor_id),

    forecast_date DATE NOT NULL,

    window_start TIME NOT NULL,

    window_end TIME NOT NULL,

    expected_train_count INTEGER NOT NULL DEFAULT 0,

    expected_traffic_level NUMERIC(5,2),

    source VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (expected_train_count >= 0),
    CHECK (
        expected_traffic_level IS NULL
        OR expected_traffic_level BETWEEN 0 AND 100
    )
);


-- ============================================================
-- 9. AI PRIORITY PREDICTIONS
-- ============================================================

CREATE TABLE task_priority_predictions (
    prediction_id BIGSERIAL PRIMARY KEY,

    task_id VARCHAR(30) NOT NULL
        REFERENCES maintenance_tasks(task_id)
        ON DELETE CASCADE,

    model_version VARCHAR(50) NOT NULL,

    priority_score NUMERIC(6,2) NOT NULL,

    priority_level VARCHAR(20) NOT NULL,

    predicted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (priority_score BETWEEN 0 AND 100)
);


-- ============================================================
-- 10. PLANNING RUNS
-- ============================================================

CREATE TABLE planning_runs (
    planning_run_id BIGSERIAL PRIMARY KEY,

    planning_date DATE NOT NULL,

    planning_start_time TIME NOT NULL,

    planning_end_time TIME NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'CREATED',

    model_version VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_by VARCHAR(100)
);


-- ============================================================
-- 11. SCHEDULE ASSIGNMENTS
-- ============================================================

CREATE TABLE schedule_assignments (
    schedule_id BIGSERIAL PRIMARY KEY,

    planning_run_id BIGINT NOT NULL
        REFERENCES planning_runs(planning_run_id)
        ON DELETE CASCADE,

    task_id VARCHAR(30) NOT NULL
        REFERENCES maintenance_tasks(task_id),

    block_id VARCHAR(30) NOT NULL
        REFERENCES maintenance_blocks(block_id),

    scheduled_start TIMESTAMP NOT NULL,

    scheduled_end TIMESTAMP NOT NULL,

    priority_score NUMERIC(6,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',

    planner_approved BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (scheduled_end > scheduled_start),

    CHECK (priority_score BETWEEN 0 AND 100)
);


-- ============================================================
-- 12. SCHEDULE CONFLICTS
-- ============================================================

CREATE TABLE schedule_conflicts (
    conflict_id BIGSERIAL PRIMARY KEY,

    planning_run_id BIGINT NOT NULL
        REFERENCES planning_runs(planning_run_id)
        ON DELETE CASCADE,

    task_id VARCHAR(30)
        REFERENCES maintenance_tasks(task_id)
        ON DELETE CASCADE,

    train_id VARCHAR(30)
        REFERENCES trains(train_id)
        ON DELETE SET NULL,

    block_id VARCHAR(30)
        REFERENCES maintenance_blocks(block_id)
        ON DELETE SET NULL,

    conflict_type VARCHAR(50) NOT NULL,

    reason TEXT,

    resolved BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_assets_department
    ON assets(department_id);

CREATE INDEX idx_assets_corridor
    ON assets(corridor_id);

CREATE INDEX idx_tasks_department
    ON maintenance_tasks(department_id);

CREATE INDEX idx_tasks_corridor
    ON maintenance_tasks(corridor_id);

CREATE INDEX idx_tasks_status
    ON maintenance_tasks(status);

CREATE INDEX idx_defects_asset
    ON maintenance_defects(asset_id);

CREATE INDEX idx_defects_task
    ON maintenance_defects(task_id);

CREATE INDEX idx_trains_corridor_date
    ON trains(corridor_id, service_date);

CREATE INDEX idx_blocks_corridor_date
    ON maintenance_blocks(corridor_id, block_date);

CREATE INDEX idx_forecasts_corridor_date
    ON goods_train_forecasts(corridor_id, forecast_date);

CREATE INDEX idx_predictions_task
    ON task_priority_predictions(task_id);

CREATE INDEX idx_predictions_score
    ON task_priority_predictions(priority_score DESC);

CREATE INDEX idx_schedule_run
    ON schedule_assignments(planning_run_id);

CREATE INDEX idx_schedule_task
    ON schedule_assignments(task_id);

CREATE INDEX idx_conflicts_run
    ON schedule_conflicts(planning_run_id);

CREATE INDEX idx_conflicts_unresolved
    ON schedule_conflicts(resolved);


-- ============================================================
-- END OF SCHEMA
-- ============================================================
