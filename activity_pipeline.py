import pandas as pd
from pathlib import Path

INPUT_FILE = "productivity_log.csv"
OUTPUT_CSV = "clean_productivity_log.csv"
OUTPUT_TXT = "output.txt"


def productivity_label(row):
    if row["keypresses"] >= 3:
        return "productive"
    elif row["mouse_clicks"] >= 2:
        return "active"
    else:
        return "low_activity"


def row_to_text(row):
    return f"""Timestamp: {row['timestamp']}
Application: {row['app']}
Window Title: {row['title']}
Hour: {row['hour']}
Weekday: {row['weekday']}
Mouse Clicks: {row['mouse_clicks']}
Keypresses: {row['keypresses']}
Mouse Activity: {row['mouse_activity']}
Typing Intensity: {row['typing_intensity']}
Idle Time: {row['idle_time']}"""


print(f"Loading: {INPUT_FILE}")
df = pd.read_csv(INPUT_FILE)

print("Columns found:")
print(df.columns.tolist())

# Fix idle_time column safely
if "idle_time" in df.columns:
    try:
        df["idle_time"] = pd.to_timedelta(df["idle_time"], errors="coerce").dt.total_seconds().fillna(0)
    except Exception:
        df["idle_time"] = pd.to_numeric(df["idle_time"], errors="coerce").fillna(0)
else:
    print("Warning: idle_time column not found. Creating default column.")
    df["idle_time"] = 0

# Timestamp features
if "timestamp" in df.columns:
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df["hour"] = df["timestamp"].dt.hour
    df["weekday"] = df["timestamp"].dt.day_name()
else:
    df["hour"] = 0
    df["weekday"] = "Unknown"

# Convert numeric columns safely
numeric_cols = [
    "mouse_clicks",
    "keypresses",
    "mouse_activity",
    "typing_intensity",
]

for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    else:
        print(f"Warning: {col} column missing. Creating default column.")
        df[col] = 0

# Create labels
df["label"] = df.apply(productivity_label, axis=1)

# Create text representation
required_text_cols = ["app", "title"]
for col in required_text_cols:
    if col not in df.columns:
        df[col] = "Unknown"

df["text"] = df.apply(row_to_text, axis=1)

# Save text output
with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
    for line in df["text"]:
        f.write(line + "\\n\\n")

# Save cleaned CSV
df.to_csv(OUTPUT_CSV, index=False)

print(f"Saved CSV: {OUTPUT_CSV}")
print(f"Saved TXT: {OUTPUT_TXT}")
print("Processing completed successfully.")
