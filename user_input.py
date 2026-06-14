from sarvamai import SarvamAI
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np


def sarvam_user_input_text(prompt: str) -> str:
    client = SarvamAI(
        api_subscription_key="sk_xc5ctv1t_ZpavH3SzO9Tkx4Ux2ut9Xycw",
    )
    response = client.chat.completions(
        model="sarvam-105b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        top_p=1,
        max_tokens=200,
    )
    return response.choices[0].message.content

def record_audio(filename="input_voice.wav", fs=16000):
    print("Recording... Press Enter to stop.")

    frames = []

    def callback(indata, frames_count, time, status):
        frames.append(indata.copy())

    stream = sd.InputStream(
        samplerate=fs,
        channels=1,
        callback=callback
    )

    stream.start()

    input()  

    stream.stop()
    stream.close()

    audio = np.concatenate(frames, axis=0)

    write(filename, fs, audio)

    print("Recording saved as", filename)



def sarvam_speech_to_text():
    client = SarvamAI(
    api_subscription_key="sk_xc5ctv1t_ZpavH3SzO9Tkx4Ux2ut9Xycw",
    )


    response = client.speech_to_text.transcribe(
    file=open("input_voice.wav", "rb"),
    model="saaras:v3",
    mode="transcribe"  # or "translate", "verbatim", "translit", "codemix"
    )
    return response.transcript


record_audio()
text = sarvam_speech_to_text()
print(text)
