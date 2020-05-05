class Error(Exception):
    """Base class for public StreamSQL client errors."""


class TableExistsError(Error):
    """Raised when the requested table name already exists."""
    def __init__(self, name):
        self.message = "Table with name \"{0}\" already exists".format(name)
