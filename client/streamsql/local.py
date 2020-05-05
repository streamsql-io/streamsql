from streamsql.errors import TableAlreadyExists
import pandas
from pandasql import sqldf


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

        table = Table.from_csv(csv_file=csv_file, primary_key=primary_key)
        self._tables[table_name] = table
        return table

    def get_table(self, table_name):
        return self._tables[table_name]

    def has_table(self, table_name):
        return table_name in self._tables

    def materialize_table(
        self,
        name="",
        query="",
        dependencies=[],
        output_columns=[],
        primary_key="",
    ):
        """Create a Table by applying a SQL query on other Tables"""
        query_ctx = {
            dep: self.get_table(dep)._dataframe
            for dep in dependencies
        }
        dataframe = sqldf(query, query_ctx)
        dataframe.columns = output_columns
        dataframe.set_index(keys=primary_key,
                            inplace=True,
                            verify_integrity=True)
        table = Table(dataframe)
        self._tables[name] = table
        return table


class Table:
    """Table is an in-memory implementation of the StreamSQL table"""
    @classmethod
    def from_csv(cls, csv_file="", primary_key=""):
        """Create a Table from a CSV file."""
        dataframe = Table._dataframe_from_csv(csv_file, primary_key)
        return cls(dataframe)

    def __init__(self, dataframe):
        """Create a Table from a pandas.DataFrame"""
        self._dataframe = dataframe

    def lookup(self, key):
        """Lookup returns an array from a table by its primary key"""
        item_series = self._dataframe.loc[key]
        return item_series.to_list()

    def __eq__(self, other):
        if isinstance(other, Table):
            return self._dataframe.equals(other._dataframe)
        else:
            return NotImplemented

    def _dataframe_from_csv(file_name, index_col):
        dataframe = pandas.read_csv(file_name, index_col=index_col)
        Table._clean_dataframe(dataframe)
        return dataframe

    def _clean_dataframe(dataframe):
        dataframe.index = dataframe.index.astype(str, copy=False)
