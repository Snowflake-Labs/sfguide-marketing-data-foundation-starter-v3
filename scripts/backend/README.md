## Set up application backend environment

```
python3.9 -m venv backend_env
source backend_env/bin/activate
pip install -r requirements.txt
```

## Run and debug locally using VSCode

The backend can be debuggued using the launch config **BackendAPI**

## Run locally

```
export FLASK_LOCAL_ENV=true
gunicorn -b :8081 api:app --reload --timeout 90
```

## Set up test environment

```
cd backend
python3.9 -m venv backend_testing  
source backend_testing/bin/activate
pip install -r requirements_test.txt

```

## run tests
```
pytest -vv --junitxml=junit/test-results.xml --cov=. --cov-report=xml --cov-report=html

```