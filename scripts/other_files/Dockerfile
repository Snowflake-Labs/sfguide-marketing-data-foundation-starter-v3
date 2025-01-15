FROM python:3.9.19-slim
WORKDIR /app

COPY frontend/dist/* ./build/

RUN mkdir ./api
COPY backend ./api/

RUN pip install -r ./api/requirements.txt

ENV FLASK_ENV=production

EXPOSE 3000

WORKDIR /app/api
CMD ["gunicorn", "-b", ":3000", "api:app"]