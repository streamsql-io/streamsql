from streamsql.errors import TableExistsError
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
        self._features = dict()

    def create_table_from_csv(self, csv_file, table_name="", primary_key=""):
        """Create a table from a local csv file"""
        if table_name in self._tables:
            raise TableExistsError(table_name)

        table = Table.from_csv(table_name,
                               csv_file=csv_file,
                               primary_key=primary_key)
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
        table = Table(name, dataframe)
        self._tables[name] = table
        return table

    def register_features(self, *feature_defs):
        for feature_def in feature_defs:
            self._register_feature(feature_def)

    def online_features(self, feature_names, entities={}):
        features = [self._features[name] for name in feature_names]
        feature_entities = [
            entities[feature.parent_entity()] for feature in features
        ]
        return [
            feature.lookup(entity)
            for feature, entity in zip(features, feature_entities)
        ]

    def _register_feature(self, feature_def):
        if feature_def.name in self._features:
            raise FeatureExistsError(feature.name)
        feature = feature_def._instatiate(self)
        self._features[feature_def.name] = feature


class Table:
    """Table is an in-memory implementation of the StreamSQL table"""
    @classmethod
    def from_csv(cls, name, csv_file="", primary_key=""):
        """Create a Table from a CSV file."""
        dataframe = Table._dataframe_from_csv(csv_file, primary_key)
        return cls(name, dataframe)

    def __init__(self, name, dataframe):
        """Create a Table from a pandas.DataFrame"""
        self.name = name
        self._dataframe = dataframe

    def lookup(self, key):
        """Lookup returns an array from a table by its primary key"""
        item_series = self._dataframe.loc[key]
        return item_series.to_list()

    def column(self, col_name):
        return Column(col_name, self._dataframe[col_name])

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


class Column:
    def __init__(self, name, series):
        self.name = name
        self._series = series

    def __getitem__(self, key):
        return self._series.loc[key]

    def min(self):
        return self._series.min()

    def max(self):
        return self._series.max()

    def mean(self):
        return self._series.mean()

    def median(self):
        return self._series.median()

    def std(self):
        return self._series.std()
