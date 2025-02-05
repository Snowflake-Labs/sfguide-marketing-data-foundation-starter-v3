FROM python:3.8

WORKDIR /code

EXPOSE 8081

ENV FLASK_APP=api.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8081
ENV FLASK_ENV=development
COPY requirements.txt .

RUN pip install -r requirements.txt && \
    pip install -I git+https://github.com/wbond/oscrypto.git

RUN pip install waitress

RUN apt-get remove -y gcc python3-dev libssl-dev && \
    apt-get autoremove -y && \
    pip uninstall pipenv

COPY . .
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
