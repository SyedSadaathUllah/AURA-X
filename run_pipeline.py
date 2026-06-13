#!/usr/bin/env python3
"""
Runnable pipeline to process productivity_log.csv similar to the notebook.

Creates:
- productivity_log_updated.csv in the user's home directory
- output.txt containing human-readable text blobs per row

This script is defensive about the `idle_time` formats found in the notebook.
"""
from pathlib import Path
import pandas as pd
import sys
import csv


def read_csv(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Input file not found: {path}")
    return pd.read_csv(path)


def parse_idle_time(x):
    """Parse idle_time that may be in several formats seen in the notebook.

    Supported formats:
    - numeric seconds or float hours (e.g., 0, 12.5)
    - 'HH.MM.SS' or 'HH.MM' where HH hours, MM minutes, SS seconds
    - pandas Timedelta string like '0 days 00:01:23'
    - '00:00:00' placeholder
    Returns float minutes (total minutes) to align with notebook decisions.
    """
    if pd.isna(x):
        return 0.0

    s = str(x).strip()

    # handle pandas timedelta format '0 days HH:MM:SS' or '1 days 01:02:03'
    if "days" in s and ":" in s:
        try:
            # take part after days
            part = s.split(" ")[-1]
            h, m, sec = [int(p) for p in part.split(":")]
            return h * 60.0 + m + sec / 60.0
        except Exception:
            pass

    # handle HH:MM:SS
    if ":" in s:
        try:
            parts = s.split(":")
            parts = [int(p) for p in parts]
            if len(parts) == 3:
                h, m, sec = parts
            elif len(parts) == 2:
                h, m = parts
                sec = 0
            else:
                return 0.0
            return h * 60.0 + m + sec / 60.0
        except Exception:
            pass

    # handle HH.MM.SS or HH.MM
    if "." in s:
        dot_parts = s.split(".")
        try:
            if len(dot_parts) == 3:
                h, m, sec = [int(p) for p in dot_parts]
                return h * 60.0 + m + sec / 60.0
            elif len(dot_parts) == 2:
                h, m = [int(p) for p in dot_parts]
                return h * 60.0 + m
            else:
                # maybe a float
                return float(s) * 60.0
        except Exception:
            pass

    # numeric string (assume minutes if small, else minutes)
    try:
        val = float(s)
        # if value looks like hours (>=24?), keep as minutes if small
        # We'll assume the original notebook used hours as float (e.g., 1.5 -> 1.5 hours).
        if val <= 24:
            # ambiguous: if <=24 treat as hours -> convert to minutes
            return val * 60.0
        return val
    except Exception:
        return 0.0


def format_idle_minutes(minutes: float) -> str:
    # Format as HH.MM.SS like the notebook's earlier formatting
    total_seconds = int(round(minutes * 60))
    hours = total_seconds // 3600
    minutes_r = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02d}.{minutes_r:02d}.{seconds:02d}"


def productivity_label(row):
    # using metrics similar to notebook final rule
    if row.get("keypresses", 0) >= 3:
        return "productive"
    elif row.get("mouse_clicks", 0) >= 2:
        return "active"
    else:
        return "low_activity"


def row_to_text(row):
    return (
        f"Timestamp: {row.get('timestamp')}\n"
        f"Application: {row.get('app')}\n"
        f"Window Title: {row.get('title')}\n"
        f"Hour: {row.get('hour')}\n"
        f"Weekday: {row.get('weekday')}\n"
        f"Mouse Clicks: {row.get('mouse_clicks')}\n"
        f"Keypresses: {row.get('keypresses')}\n"
        f"Mouse Activity: {row.get('mouse_activity')}\n"
        f"Typing Intensity: {row.get('typing_intensity')}\n"
        f"Idle Time: {row.get('idle_time_formatted')}"
    )


def main():
    workspace = Path(__file__).resolve().parent
    input_path = workspace / "productivity_log.csv"

    try:
        df = read_csv(input_path)
    except FileNotFoundError as e:
        print(e)
        print("Place `productivity_log.csv` in the project folder and re-run.")
        sys.exit(2)

    # ensure timestamp parsed
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df["hour"] = df["timestamp"].dt.hour
        df["weekday"] = df["timestamp"].dt.day_name()

    # numeric conversions
    numeric_cols = [
        "mouse_clicks",
        "keypresses",
        "mouse_activity",
        "typing_intensity",
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)
        else:
            df[col] = 0

    # parse idle_time to minutes
    if "idle_time" in df.columns:
        df["idle_time_minutes"] = df["idle_time"].apply(parse_idle_time)
    else:
        df["idle_time_minutes"] = 0.0

    # formatted representation
    df["idle_time_formatted"] = df["idle_time_minutes"].apply(format_idle_minutes)

    # create label
    df["label"] = df.apply(productivity_label, axis=1)

    # text column
    df["text"] = df.apply(row_to_text, axis=1)

    # save outputs
    out_csv = Path.home() / "productivity_log_updated.csv"
    df.to_csv(out_csv, index=False)
    print(f"Saved CSV to: {out_csv}")

    out_txt = workspace / "output.txt"
    with open(out_txt, "w", encoding="utf-8") as f:
        for line in df["text"]:
            f.write(line + "\n\n")
    print(f"Saved human-readable output to: {out_txt}")


if __name__ == "__main__":
    main()
