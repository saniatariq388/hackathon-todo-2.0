from setuptools import setup, find_packages

setup(
    name="hackathon-todo-2.0",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "sqlmodel",
        "uvicorn",
        "alembic",
        "pydantic-settings",
        "python-jose[cryptography]",
        "python-multipart",
        "psycopg2-binary",
    ],
)