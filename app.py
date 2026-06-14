from activity_pipeline import stream_txt
import time
from sarvamai import SarvamAI
from elevenlabs import ElevenLabs
from sarvamai import SarvamAI
from sarvamai.play import save
import subprocess

client = SarvamAI(
    api_subscription_key="sk_xc5ctv1t_ZpavH3SzO9Tkx4Ux2ut9Xycw",
)

def query_sarvam(prompt: str) -> str:
    response = client.chat.completions(
        model="sarvam-105b",
        messages=[
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        top_p=1,
        max_tokens=2000,
    )

    generated_text = response.choices[0].message.content
    return generated_text.strip()

prompt = """
Analyze this activity data and respond in exactly 20 words or less.
Include one insight, one recommendation, or a joke based on the activity.
"""
def sarvam_text_speech(text: str):
    client = SarvamAI(api_subscription_key="sk_xc5ctv1t_ZpavH3SzO9Tkx4Ux2ut9Xycw")
    audio = client.text_to_speech.convert(
    target_language_code="en-IN",
    text=text,
    model="bulbul:v3",
    speaker="shubh"
    )
    save(audio, "output.wav")
    subprocess.Popen(["start", "output.wav"], shell=True)


while True:
    txt_data = stream_txt()
    result = query_sarvam(txt_data + "\n\n" + prompt)
    print(result)
    sarvam_text_speech(result)
    time.sleep(5)