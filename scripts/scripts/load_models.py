import os
from scripts.update_file_variables import file_replace
from scripts.executeStatement import executeCopyToStage

def load_models(database: str, models_folder: str, stage: str) -> None:
    dirs_ignore = ["/streamlit/frontend", "pycache", "tests"]
    is_ignore = (
        lambda path: len(list(filter(lambda ignore: ignore in path, dirs_ignore))) > 0
    )
    replace_map = {
        "<TARGET_DATABASE>": database
    }

    for path, currentDirectory, files in os.walk(models_folder):
        
        for file in files:
            if not file.startswith(".") and not is_ignore(path):
                file_replace(f"{path}/{file}", replace_map)
                # model_name = file.split(".")[0]
    executeCopyToStage(models_folder, stage)
