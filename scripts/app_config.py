import os
import json


def get_app_config(app_config_f: str) -> dict:
    with open(app_config_f) as app_f:
        app_config = json.load(app_f)

    _load_docker_envs(app_config)

    return app_config


def _load_docker_envs(app_config) -> None:
    account = app_config['account_registry']
    version = app_config['image_version']
    image_name = app_config['image_name']
    image_repo = str.lower(f"{account}/{app_config['database']}/{app_config['schema']}/{app_config['image_stage']}")


    os.environ["DOCKER_APP_REGISTRY"] = account
    os.environ["IMAGE_REPOSITORY"] = image_repo
    os.environ["IMAGE_REPO_SHORT"] = str.lower(f"/{app_config['database']}/{app_config['schema']}/{app_config['image_stage']}/")
    os.environ["IMAGE_VERSION"] = version
    os.environ["IMAGE_NAME"] = f"{image_name}:{version}"
    print(f"Image Repository: {os.environ['IMAGE_NAME']}")
