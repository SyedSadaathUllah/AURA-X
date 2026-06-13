# Activity pipeline runner

This repository contains a small runnable script `run_pipeline.py` which reproduces and hardens the logic from `activity_pipeline.ipynb`.

What it does:
- Reads `productivity_log.csv` from the project root
- Parses timestamps and several `idle_time` formats
- Computes `hour`, `weekday`, `label`, and a `text` field per row
- Writes `productivity_log_updated.csv` to your home directory
- Writes `output.txt` (human-readable text) to the project folder

Quick start:

1. Create and activate a Python 3 venv (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the pipeline:

```bash
python run_pipeline.py
```

If `productivity_log.csv` is missing, place it in the project folder and re-run.

# Voice Module

## Install

pip install -r requirements.txt

## Run

python voice_manager.py

Place an audio file named input.wav in the same folder.
