from aw_client import ActivityWatchClient
import csv
import sys

client = ActivityWatchClient("csv-export")

# Get all available buckets
buckets = client.get_buckets()

# Find the input bucket automatically
input_bucket = None

for bucket_name in buckets.keys():
    if bucket_name.startswith("aw-watcher-input"):
        input_bucket = bucket_name
        break

if input_bucket is None:
    print("❌ No input watcher bucket found.")
    print("\nAvailable buckets:")

    for bucket_name in buckets.keys():
        print(f" - {bucket_name}")

    print(
        "\nMake sure the ActivityWatch input watcher is installed and running."
    )
    sys.exit(1)

print(f"✅ Using bucket: {input_bucket}")

# Get events
events = client.get_events(input_bucket, limit=1000)

with open("input_activity.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow([
        "timestamp",
        "duration",
        "presses",
        "clicks",
        "deltaX",
        "deltaY",
        "scrollX",
        "scrollY"
    ])

    for event in events:
        data = event.get("data", {})

        writer.writerow([
            event.get("timestamp"),
            event.get("duration"),
            data.get("presses", 0),
            data.get("clicks", 0),
            data.get("deltaX", 0),
            data.get("deltaY", 0),
            data.get("scrollX", 0),
            data.get("scrollY", 0)
        ])

print(f"✅ Exported {len(events)} events to input_activity.csv")