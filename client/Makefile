VENV := venv
VENV_BIN := ./$(VENV)/bin/
ifeq ($(OS),Windows_NT)
VENV_BIN := ./$(VENV)/Scripts/
endif

PYCMD := $(VENV_BIN)python

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

COVERAGE := $(PYCMD) -m coverage
FORMAT := $(PYCMD) -m yapf

# print out test coverage to sysout.
coverage: test
	$(COVERAGE) report -m

coverage.xml: install-dev
	$(COVERAGE) xml

# test also generates a coverage file.
test: install-dev
	$(COVERAGE) run --source streamsql -m pytest --verbose ./tests

# format formats all python files in-place.
format: install-dev
	$(FORMAT) -i -r -p ./streamsql ./tests

clean:
	rm install-dev
	rm -R venv

# returns a non-zero value if code is not formatted.
check-format: install-dev
	$(FORMAT) -r -p -q ./streamsql ./tests

# install-dev installs all dependencies for python development of streamsql.
install-dev: $(VENV) ./requirements.txt
	${PYCMD} -m pip install -e . && touch install-dev

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
