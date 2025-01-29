import os
import json
import subprocess


def load_models(database: str, models_folder: str) -> None:
    dirs_ignore = ["/streamlit/frontend", "pycache", "tests"]
    is_ignore = (
        lambda path: len(list(filter(lambda ignore: ignore in path, dirs_ignore))) > 0
    )
    for path, currentDirectory, files in os.walk(models_folder):
        
        for file in files:
            if not file.startswith(".") and not is_ignore(path):
                model_name = file.split(".")[0]
                # build the relative paths to the file
                local_file = os.path.join(path, file)
                with open(local_file) as file:
                    content = json.loads(file.read().replace("<TARGET_DATABASE>", database))
                    model_id = content['id']
                    query = f"""
                            INSERT INTO {database}.METADATA.MODELS(MODEL_ID, MODEL_NAME, TARGET_DATABASE, TARGET_SCHEMA, MODEL_UI, CREATED_TIMESTAMP)
                            SELECT {model_id}, '{model_name}', '{database}', 'TARGET', parse_json($${content}$$), SYSDATE()
                            """.replace("&", "&&")
                    subprocess.run(['snow', 'sql', '-q', f"{query}"])
                print(f"{model_name} loaded")
                