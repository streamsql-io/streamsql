PYCMD := python3
# On Windows, if the python3 command is not found, use py -3
ifeq ($(OS),Windows_NT)
ifeq (,$(shell where python3))
PYCMD := py -3
endif
endif

# print out test coverage to sysout.
coverage: test
	coverage report -m

# test also generates a coverage file.
test:
	PYTHONPATH=$(PYTHONPATH):client coverage run --source streamsql -m pytest --verbose ./client/tests

# format formats all python files in-place.
format:
	yapf -i -r -p ./client/

# returns a non-zero value if code is not formatted.
check-format:
	yapf -r -p -q ./client/

# install-dev installs all dependencies for python development of streamsql.
install-dev:
	${PYCMD} -m pip install -r ./client/requirements.txt

# Used in CI since setuptools was not included by default on Ubuntu.
install-py-setuptools:
	${PYCMD} -m pip install setuptools

# Used in CI to use the PYCMD variable to upgrade pip.
upgrade-pip:
	${PYCMD} -m pip install --upgrade pip
