# print out test coverage to sysout.
coverage: test
	coverage report -m

# test also generates a coverage file.
test:
	PYTHONPATH=$(PYTHONPATH):client coverage run --source streamsql -m pytest --verbose client/tests

# format formats all python files in-place.
format:
	yapf -i -r -p client/

# install-dev installs all dependencies for python development of streamsql.
install-dev:
	pip3 install -r client/requirements.txt
