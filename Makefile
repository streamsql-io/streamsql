VENV :=
PYCMD := $(VENV_BIN)/python3

VENV_BIN := ./$(VENV)/bin/
ifeq ($(OS),Windows_NT)
VENV_BIN := ./$(VENV)/Scripts/
endif

SYS_PYCMD := python3
# On Windows, if the python3 command is not found, use py -3
ifeq ($(OS),Windows_NT)
SYS_PYCMD := python
# Check both which and where, depends on which shell is being used.
ifeq (,$(shell which python))
ifeq (,$(shell where python))
SYS_PYCMD := py -3
endif
endif
endif

# If we aren't using VENV
ifeq ($(VENV),)
PYCMD := $(SYS_PYCMD)
VENV_BIN :=
endif

# print out test coverage to sysout.
coverage: test
	$(VENV_BIN)coverage report -m

coverage.xml: install-dev
	$(VENV_BIN)coverage xml

# test also generates a coverage file.
test: install-dev
	$(VENV_BIN)coverage run --source streamsql -m pytest --verbose ./client/tests

# format formats all python files in-place.
format: install-dev
	$(VENV_BIN)yapf -i -r -p ./client/

clean:
	rm install-dev
	rm -R venv

# returns a non-zero value if code is not formatted.
check-format: install-dev
	$(VENV_BIN)yapf -r -p -q ./client/

# install-dev installs all dependencies for python development of streamsql.
install-dev: $(VENV) ./client/requirements.txt
	${PYCMD} -m pip install -e client && touch install-dev

# Create a Python virtual environment under ./venv
$(VENV):
	${SYS_PYCMD} -m venv ./venv && \
	${PYCMD} -m pip install --upgrade pip

# Used in CI to use the PYCMD variable to install virtualenv
install-venv:
	${SYS_PYCMD} -m pip install virtualenv

# Used in CI to use the PYCMD variable to upgrade pip.
upgrade-pip:
	${SYS_PYCMD} -m pip install --upgrade pip

# Used in CI since setuptools was not included by default on Ubuntu.
install-py-setuptools:
	${SYS_PYCMD} -m pip install setuptools
