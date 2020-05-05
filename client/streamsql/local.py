from streamsql.errors import TableAlreadyExists
import pandas


class FeatureStore:
    """Feature is a local in-memory feature store

    The local feature store provides a subset of the core functionality
    of the backend one. It should only be used for models that are
    trained and used locally.
    """
    def __init__(self):
        self._tables = dict()

    def create_table_from_csv(self, csv_file, table_name="", primary_key=""):
        """Create a table from a local csv file"""
        if table_name in self._tables:
            raise TableAlreadyExists(table_name)

        table = Table(csv_file=csv_file, primary_key=primary_key)
        self._tables[table_name] = table
        return table

    def get_table(self, table_name):
        return self._tables[table_name]

    def has_table(self, table_name):
        return table_name in self._tables


class Table:
    """Table is an in-memory implementation of the StreamSQL table"""
    def __init__(self, csv_file="", primary_key=""):
        """Table can be instatiated from a CSV file."""
        self._dataframe = self._dataframe_from_csv(csv_file, primary_key)

    def lookup(self, key):
        """Lookup returns an array from a table by its primary key"""
        item_series = self._dataframe.loc[key]
        return item_series.to_list()

    def __eq__(self, other):
        if isinstance(other, Table):
            return self._dataframe.equals(other._dataframe)
        else:
            return NotImplemented

    def _dataframe_from_csv(self, file_name, index_col):
        dataframe = pandas.read_csv(file_name, index_col=index_col)
        self._clean_dataframe(dataframe)
        return dataframe

    def _clean_dataframe(self, dataframe):
        dataframe.index = dataframe.index.astype(str, copy=False)
