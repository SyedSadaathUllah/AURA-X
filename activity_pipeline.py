from activityWatch import stream_activity_csv
import pandas as pd
import time

def stream_txt():
    for csv_string in stream_activity_csv():
        txt_data = str(csv_string)
        return txt_data


    
