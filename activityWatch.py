# from aw_client import ActivityWatchClient
# import csv
# import time
# import math
# from datetime import datetime

# client = ActivityWatchClient("productivity-logger")

# CSV_FILE = "productivity_log.csv"


# try:
#     with open(CSV_FILE, "x", newline="", encoding="utf-8") as f:
#         writer = csv.writer(f)
#         writer.writerow([
#             "timestamp",
#             "app",
#             "title",
#             "mouse_clicks",
#             "keypresses",
#             "mouse_activity",
#             "typing_intensity",
#             "idle_time"
#         ])
# except FileExistsError:
#     pass


# def find_bucket(keyword):
#     buckets = client.get_buckets()

#     for bucket_id in buckets:
#         if keyword.lower() in bucket_id.lower():
#             return bucket_id

#     return None


# window_bucket = find_bucket("window")
# input_bucket = find_bucket("input")
# afk_bucket = find_bucket("afk")

# print("Window Bucket:", window_bucket)
# print("Input Bucket:", input_bucket)
# print("AFK Bucket:", afk_bucket)

# while True:
#     try:
#         app = ""
#         title = ""
#         mouse_clicks = 0
#         keypresses = 0
#         mouse_activity = 0
#         typing_intensity = 0


#         if window_bucket:
#             events = client.get_events(window_bucket, limit=1)

#             if events:
#                 data = events[0].get("data", {})
#                 app = data.get("app", "")
#                 title = data.get("title", "")


#         if input_bucket:
#             events = client.get_events(input_bucket, limit=1)

#             if events:
#                 event = events[0]
#                 data = event.get("data", {})

#                 mouse_clicks = data.get("clicks", 0)
#                 keypresses = data.get("presses", 0)

#                 delta_x = data.get("deltaX", 0)
#                 delta_y = data.get("deltaY", 0)

#                 mouse_activity = round(
#                     math.sqrt(delta_x**2 + delta_y**2),
#                     2
#                 )

#                 duration = event.get("duration")

#         with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
#             writer = csv.writer(f)

#             writer.writerow([
#                 datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#                 app,
#                 title,
#                 mouse_clicks,
#                 keypresses,
#                 mouse_activity,
#                 typing_intensity,
#                 duration
#             ])

#     except Exception as e:
#         print("Error:", e)

#     time.sleep(3)

from aw_client import ActivityWatchClient
import math
import io
import csv
import time

client = ActivityWatchClient("productivity-logger")

def find_bucket(keyword):
    buckets = client.get_buckets()
    for bucket_id in buckets:
        if keyword.lower() in bucket_id.lower():
            return bucket_id
    return None

window_bucket = find_bucket("window")
input_bucket  = find_bucket("input")
afk_bucket    = find_bucket("afk")

def read_activity_data() -> dict:
    data = {}

    if window_bucket:
        events = client.get_events(window_bucket, limit=1)
        if events:
            d = events[0].get("data", {})
            data["timestamp"] = events[0].get("timestamp")
            data["app"]       = d.get("app", "")
            data["title"]     = d.get("title", "")

    if input_bucket:
        events = client.get_events(input_bucket, limit=1)
        if events:
            d = events[0].get("data", {})
            delta_x = d.get("deltaX", 0)
            delta_y = d.get("deltaY", 0)
            data["mouse_clicks"]   = d.get("clicks", 0)
            data["keypresses"]     = d.get("presses", 0)
            data["mouse_activity"] = round(math.sqrt(delta_x**2 + delta_y**2), 2)
            data["idle_time"]      = events[0].get("duration")

    return data


def get_activity_csv() -> str:
    """Returns current activity snapshot as a CSV string. Nothing is written to disk."""
    entry = read_activity_data()

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=entry.keys())
    writer.writeheader()
    writer.writerow(entry)

    return output.getvalue()

def stream_activity_csv(interval: int = 3):
    """Yields a CSV string every `interval` seconds. Nothing is written to disk."""
    while True:
        yield get_activity_csv()
        time.sleep(interval)