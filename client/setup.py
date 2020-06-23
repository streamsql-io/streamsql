import setuptools

from setuptools import find_packages, setup

with open('requirements.txt', 'r') as req_file:
    requirements = [req.strip() for req in req_file.read().splitlines()]

with open("./README.md") as f:
    long_description = f.read()

setuptools.setup(
    name="streamsql",
    version="2.0.0",
    url="https://github.com/streamsql-io/streamsql",
    description="Python SDK for the StreamSQL feature store",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="The StreamSQL Team",
    author_email="simba@streamsql.io",
    install_requires=requirements,
    python_requires=">=3.6.0",
    packages=setuptools.find_packages(exclude=("tests", )),
    license="AGPLv3",
    classifiers=[
        "License :: OSI Approved :: GNU Affero General Public License v3",
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Operating System :: OS Independent",
    ],
)
