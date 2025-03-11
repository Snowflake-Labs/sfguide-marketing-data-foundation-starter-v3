from flask import Flask

app = Flask(__name__, static_folder="../build", static_url_path="/")

import os
import controllers


@app.route("/")
def index():
    return app.send_static_file("index.html")


def _local_cors_config():
    from flask_cors import CORS
    CORS(app, origins=["http://localhost:8080"], resources=[r"/api/*", r"/account/*"])


if os.environ.get("FLASK_LOCAL_ENV") is not None:
    _local_cors_config()

if __name__ == "__main__":
    api_port = int(os.getenv("API_PORT") or 8081)
    app.run(port=api_port, host="0.0.0.0")
