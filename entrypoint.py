from activity_pipeline import csv_txt_converter
from sarvamai import SarvamAI


Ai_input = csv_txt_converter()

prompt = f"Analyze the following user activity data and make some jokes on productivity patterns:\n\n{Ai_input}"

def entrypoint():
    client = SarvamAI(
        api_subscription_key="sk_xc5ctv1t_ZpavH3SzO9Tkx4Ux2ut9Xycw",
    )
    response = client.chat.completions(
        model="sarvam-105b",
        messages=[
        {"role": "user", "content": f"{prompt}"}
    ],
    )

    content = response.choices[0].message.content
    return content

example_response = entrypoint()
print(example_response)