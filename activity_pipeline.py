import pandas as pd

df = pd.read_csv('productivity_log.csv')

text_file = df.to_csv('output.txt', sep=' ', index=False)

def csv_txt_converter():
    with open('productivity_log.csv', 'r', encoding='utf-8') as f_in, \
     open('my_file.txt', 'r', encoding='utf-8') as f_out:

        content = f_out.read()
        return content
    
