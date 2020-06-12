# Typical Python executable name depends on OS
ifeq ($(OS),Windows_NT)
PYCMD := py -3
else
PYCMD := python3
endif

# print out test coverage to sysout.
coverage: test
	coverage report -m

# test also generates a coverage file.
test:
	PYTHONPATH=$(PYTHONPATH):client coverage run --source streamsql -m pytest --verbose client/tests

# format formats all python files in-place.
format:
	yapf -i -r -p client/

check-format:
	yapf -r -p -q client/

# install-dev installs all dependencies for python development of streamsql.
install-dev:
	${PYCMD} -m pip install -r client/requirements.txt

# Used in CI since setuptools was not included by default on Ubuntu.
install-py-setuptools:
	${PYCMD} -m pip install setuptools

# Used in CI to use the PYCMD variable to upgrade pip.
upgrade-pip:
	${PYCMD} -m pip install --upgrade pip
