from pathlib import Path


class DataEntryPoint:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)

    def get_context(self) -> str:
        """
        Reads the text file and returns its contents.
        """
        try:
            with open(self.file_path, "r", encoding="utf-8") as file:
                return file.read()

        except FileNotFoundError:
            return "No activity data found."

        except Exception as e:
            return f"Error reading file: {e}"


if __name__ == "__main__":
    data_source = DataEntryPoint("output.txt")

    context = data_source.get_context()

    print("=== DATA SENT TO AI ===")
    print(context)