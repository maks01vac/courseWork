import sys
import json

def process_data(data):
    # Проверяем наличие поля "multiConnectionNodes" в данных
    if "multiConnectionNodes" in data:
        # Проходим по каждому объекту в массиве "multiConnectionNodes"
        for node in data["multiConnectionNodes"]:
            # Изменяем поля "fluidFlow" и "pressure"
            node["fluidFlow"] = 1
            node["pressure"] = 1

    return data





if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        processed_data = process_data(input_data)
        print(json.dumps(processed_data))
    except Exception as e:
        sys.stderr.write(f"Python error: {e}")
        sys.exit(1)