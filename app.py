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
    return generated_text

prompt = """
Analyze this activity data and respond in exactly 20 words or less.
Include one insight, one recommendation, or a joke based on the activity.
"""
def ele_text_speech(text: str):
    client = ElevenLabs(
    api_key="78c66b79be8709f51253cd38b682ff2bb316f5676191d4c1b9b35dfa319d60a6"
    )
    audio = client.text_to_speech.convert(
    text=text,
    voice_id="mQn5orpvorFdd7wFUc5o",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
    )
    with open("output.wav", "wb") as f:
        for chunk in audio:
            if chunk:
                f.write(chunk)
    
    subprocess.Popen(["start", "output.wav"], shell=True)



while True:
    txt_data = stream_txt()
    result = query_sarvam(txt_data + "\n\n" + prompt)
    print(result)
    ele_text_speech(result)
    time.sleep(5)