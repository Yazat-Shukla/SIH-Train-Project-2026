-- ============================================================
-- BLACKFIRE - PROTOTYPE SEED DATA
-- SIH26027
-- ============================================================


-- ============================================================
-- 1. DEPARTMENTS
-- ============================================================

INSERT INTO departments (
    department_code,
    name,
    description
)
VALUES
    (
        'ENG',
        'Engineering',
        'Track and civil engineering maintenance'
    ),
    (
        'SNT',
        'S&T',
        'Signal and telecommunications maintenance'
    ),
    (
        'TRC',
        'Traction',
        'Traction and OHE maintenance'
    );


-- ============================================================
-- 2. CORRIDORS
-- ============================================================

INSERT INTO corridors (
    corridor_id,
    name,
    description,
    location
)
VALUES
    (
        'C01',
        'Delhi Main Corridor',
        'Main corridor for Engineering and S&T maintenance',
        'Delhi'
    ),
    (
        'C02',
        'Delhi Traction Corridor',
        'Corridor for traction and OHE maintenance',
        'Delhi'
    ),
    (
        'C03',
        'Delhi Engineering Corridor',
        'Engineering maintenance corridor',
        'Delhi'
    );


-- ============================================================
-- 3. ASSETS
-- ============================================================

INSERT INTO assets (
    asset_code,
    asset_name,
    asset_type,
    department_id,
    corridor_id,
    location,
    importance_score,
    status
)
VALUES
    (
        'TRK-12',
        'Track-12',
        'TRACK',
        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'ENG'
        ),
        'C01',
        'Delhi',
        10.00,
        'AVAILABLE'
    ),

    (
        'SIG-21',
        'Signal-21',
        'SIGNAL',
        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'SNT'
        ),
        'C01',
        'Delhi',
        9.00,
        'AVAILABLE'
    ),

    (
        'OHE-45',
        'OHE-45',
        'OHE',
        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'TRC'
        ),
        'C02',
        'Delhi',
        8.00,
        'AVAILABLE'
    ),

    (
        'TRK-08',
        'Track-08',
        'TRACK',
        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'ENG'
        ),
        'C03',
        'Delhi',
        7.00,
        'AVAILABLE'
    ),

    (
        'SIG-18',
        'Signal-18',
        'SIGNAL',
        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'SNT'
        ),
        'C02',
        'Delhi',
        6.00,
        'AVAILABLE'
    );


-- ============================================================
-- 4. MAINTENANCE TASKS
--
-- These values match the current AIML sample input.
-- Priority is NOT stored here because the AI calculates it.
-- ============================================================

INSERT INTO maintenance_tasks (
    task_id,
    asset_id,
    department_id,
    corridor_id,
    task_type,
    description,
    criticality,
    severity,
    asset_importance,
    train_impact,
    overdue_days,
    historical_failures,
    duration_minutes,
    status
)
VALUES

    (
        'ENG-104',

        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'TRK-12'
        ),

        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'ENG'
        ),

        'C01',

        'Track Maintenance',

        'Urgent maintenance required for Track-12',

        10,
        9,
        10,
        8,
        6,
        3,
        120,

        'PENDING'
    ),

    (
        'SNT-205',

        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'SIG-21'
        ),

        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'SNT'
        ),

        'C01',

        'Signal Maintenance',

        'Signal-21 requires maintenance',

        9,
        8,
        9,
        7,
        3,
        2,
        90,

        'PENDING'
    ),

    (
        'TRC-102',

        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'OHE-45'
        ),

        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'TRC'
        ),

        'C02',

        'OHE Maintenance',

        'OHE-45 maintenance task',

        7,
        7,
        8,
        6,
        2,
        1,
        60,

        'IN_PROGRESS'
    ),

    (
        'ENG-118',

        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'TRK-08'
        ),

        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'ENG'
        ),

        'C03',

        'Track Maintenance',

        'Track-08 maintenance task',

        6,
        5,
        7,
        5,
        1,
        1,
        45,

        'PENDING'
    ),

    (
        'SNT-214',

        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'SIG-18'
        ),

        (
            SELECT department_id
            FROM departments
            WHERE department_code = 'SNT'
        ),

        'C02',

        'Signal Maintenance',

        'Signal-18 maintenance task',

        5,
        4,
        6,
        4,
        0,
        1,
        60,

        'SCHEDULED'
    );


-- ============================================================
-- 5. MAINTENANCE DEFECTS
-- ============================================================

INSERT INTO maintenance_defects (
    asset_id,
    task_id,
    defect_type,
    description,
    severity,
    status
)
VALUES
    (
        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'TRK-12'
        ),

        'ENG-104',

        'TRACK WEAR',

        'Abnormal wear detected on Track-12',

        9,

        'OPEN'
    ),

    (
        (
            SELECT asset_id
            FROM assets
            WHERE asset_code = 'SIG-21'
        ),

        'SNT-205',

        'SIGNAL FAULT',

        'Intermittent signal failure detected',

        8,

        'OPEN'
    );


-- ============================================================
-- 6. TRAINS
--
-- These match the AIML sample input.
-- ============================================================

INSERT INTO trains (
    train_id,
    train_number,
    train_name,
    corridor_id,
    service_date,
    start_time,
    end_time,
    train_type
)
VALUES
    (
        '12951',
        '12951',
        'Rajdhani Express',
        'C01',
        CURRENT_DATE,
        '22:30',
        '23:00',
        'EXPRESS'
    ),

    (
        '12002',
        '12002',
        'Shatabdi Express',
        'C01',
        CURRENT_DATE + 1,
        '00:15',
        '00:45',
        'EXPRESS'
    ),

    (
        '12401',
        '12401',
        'Express Service',
        'C02',
        CURRENT_DATE,
        '23:00',
        '23:30',
        'EXPRESS'
    );


-- ============================================================
-- 7. MAINTENANCE BLOCKS
--
-- These match the AIML sample windows.
-- Overnight blocks are represented using the start date.
-- ============================================================

INSERT INTO maintenance_blocks (
    block_id,
    corridor_id,
    block_date,
    start_time,
    end_time,
    status,
    description
)
VALUES
    (
        'B21',
        'C01',
        CURRENT_DATE,
        '22:00',
        '02:00',
        'AVAILABLE',
        'Night maintenance block for C01'
    ),

    (
        'B22',
        'C02',
        CURRENT_DATE,
        '22:00',
        '01:00',
        'AVAILABLE',
        'Night maintenance block for C02'
    ),

    (
        'B23',
        'C03',
        CURRENT_DATE,
        '23:00',
        '01:00',
        'AVAILABLE',
        'Night maintenance block for C03'
    );


-- ============================================================
-- 8. GOODS TRAIN FORECASTS
--
-- Prototype data for future traffic-aware planning.
-- ============================================================

INSERT INTO goods_train_forecasts (
    corridor_id,
    forecast_date,
    window_start,
    window_end,
    expected_train_count,
    expected_traffic_level,
    source
)
VALUES
    (
        'C01',
        CURRENT_DATE,
        '22:00',
        '23:00',
        3,
        70.00,
        'PROTOTYPE'
    ),

    (
        'C01',
        CURRENT_DATE,
        '23:00',
        '00:00',
        1,
        30.00,
        'PROTOTYPE'
    ),

    (
        'C02',
        CURRENT_DATE,
        '22:00',
        '23:00',
        2,
        60.00,
        'PROTOTYPE'
    ),

    (
        'C03',
        CURRENT_DATE,
        '23:00',
        '00:00',
        1,
        25.00,
        'PROTOTYPE'
    );
