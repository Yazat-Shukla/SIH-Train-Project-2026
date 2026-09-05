import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

from xgboost import XGBClassifier


# ============================================================
# 1. LOAD DATASET
# ============================================================

DATA_PATH = "aiml/data/indian_railway_predictive_maintenance_100k.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# ============================================================
# 2. TARGET
# ============================================================

TARGET = "maintenance_required"

# These columns are deliberately excluded:
# - train_id: identifier, not a useful predictive feature
# - failure_type: outcome information / leakage
# - failure_severity: outcome information / leakage
# - risk_score: excluded until its construction is verified

DROP_COLUMNS = [
    TARGET,
    "train_id",
    "failure_type",
    "failure_severity",
    "risk_score",
]

X = df.drop(columns=DROP_COLUMNS)
y = df[TARGET]

print("\nFeatures:")
print(X.columns.tolist())

print("\nTarget distribution:")
print(y.value_counts())

print("\nTarget proportion:")
print(y.value_counts(normalize=True).round(3))


# ============================================================
# 3. FEATURE TYPES
# ============================================================

# Explicitly defined instead of using select_dtypes().
# This avoids pandas string/object dtype compatibility warnings.

categorical_features = [
    "region",
    "season",
    "train_type",
    "ballast_condition",
    "signal_system_status",
]

numeric_features = [
    "train_age_years",
    "average_speed_kmph",
    "distance_travelled_km",
    "track_temperature_c",
    "rail_wear_mm",
    "track_vibration_level",
    "track_curvature_degree",
    "ambient_temperature_c",
    "humidity_percent",
    "rainfall_mm",
    "wind_speed_kmph",
    "wheel_wear_percent",
    "axle_temperature_c",
    "brake_pressure_psi",
    "brake_pad_wear_percent",
    "bearing_temperature_c",
    "battery_voltage",
    "traction_motor_temp_c",
    "power_consumption_kw",
    "load_factor_percent",
    "daily_trips",
    "delay_minutes",
    "last_maintenance_days",
    "inspection_score",
    "sensor_health_index",
]

print("\nCategorical features:")
print(categorical_features)

print("\nNumeric features:")
print(numeric_features)


# ============================================================
# 4. PREPROCESSING
# ============================================================

numeric_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median"),
        )
    ]
)

categorical_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent"),
        ),
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False,
            ),
        ),
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            numeric_transformer,
            numeric_features,
        ),
        (
            "cat",
            categorical_transformer,
            categorical_features,
        ),
    ]
)


# ============================================================
# 5. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 6. CLASS IMBALANCE
# ============================================================

negative_count = (y_train == 0).sum()
positive_count = (y_train == 1).sum()

scale_pos_weight = negative_count / positive_count

print(
    f"\nXGBoost scale_pos_weight: {scale_pos_weight:.4f}"
)


# ============================================================
# 7. XGBOOST MODEL
# ============================================================

model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="binary:logistic",
    eval_metric="logloss",
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    n_jobs=-1,
)


# ============================================================
# 8. COMPLETE PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor,
        ),
        (
            "model",
            model,
        ),
    ]
)


# ============================================================
# 9. TRAIN
# ============================================================

print("\nTraining XGBoost...")

pipeline.fit(
    X_train,
    y_train,
)


# ============================================================
# 10. PREDICTION
# ============================================================

y_pred = pipeline.predict(X_test)


# ============================================================
# 11. EVALUATION
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred,
)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0,
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0,
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0,
)


print("\n===================================")
print("XGBOOST MAINTENANCE MODEL RESULTS")
print("===================================")

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")


# ============================================================
# 12. CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "No Maintenance",
            "Maintenance Required",
        ],
        zero_division=0,
    )
)


# ============================================================
# 13. CONFUSION MATRIX
# ============================================================

print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred,
    )
)