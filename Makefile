PYCMD := python3
# On Windows, if the python3 command is not found, use py -3
ifeq ($(OS),Windows_NT)
PYCMD := python
# Check both which and where, depends on which shell is being used.
ifeq (,$(shell which python))
ifeq (,$(shell where python))
PYCMD := py -3
endif
endif
endif

# print out test coverage to sysout.
coverage: test
	coverage report -m

coverage.xml:
	coverage xml

# test also generates a coverage file.
test:
#	PYTHONPATH=$(PYTHONPATH):client coverage run --source streamsql -m pytest --verbose ./client/tests
	coverage run --source streamsql -m pytest --verbose ./client/tests

# format formats all python files in-place.
format:
	yapf -i -r -p ./client/

# returns a non-zero value if code is not formatted.
check-format:
	yapf -r -p -q ./client/

# install-dev installs all dependencies for python development of streamsql.
install-dev:
	${PYCMD} -m pip install -e client

# Create a Python virtual environment under ./venv
venv:
	${PYCMD} -m venv ./venv

# Used in CI to use the PYCMD variable to install virtualenv
install-venv:
	${PYCMD} -m pip install virtualenv

# Used in CI to use the PYCMD variable to upgrade pip.
upgrade-pip:
	${PYCMD} -m pip install --upgrade pip

# Used in CI since setuptools was not included by default on Ubuntu.
install-py-setuptools:
	${PYCMD} -m pip install setuptools
