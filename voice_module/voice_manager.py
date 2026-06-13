from speech_to_text import transcribe
from text_to_speech import speak

def process(audio_file):
    text = transcribe(audio_file)
    print("User:", text)

    response = f"You said: {text}"

    print("AI:", response)
    speak(response)

if __name__ == "__main__":
    process("input.wav")
