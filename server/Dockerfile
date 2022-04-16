FROM python:3.10.2-slim-buster

ENV POETRY_VERSION=1.0.8

#System dependencies
RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app/

COPY pyproject.toml /app/
COPY poetry.lock /app/

RUN poetry install --no-dev

COPY . /app/

CMD ["poetry", "run", "uvicorn", "server:app", "--host", "0.0.0.0"]