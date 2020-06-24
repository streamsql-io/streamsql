import streamsql.errors as errors
import pandas
import uuid
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
        self._training_sets = dict()

    def create_table_from_csv(self, csv_file, table_name="", primary_key=None):
        """Create a table from a local csv file"""
        if table_name in self._tables:
            raise errors.TableExistsError(table_name)

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
        entity_values = [
            entities[feature.parent_entity()] for feature in features
        ]
        return [
            feature.lookup(entity)
            for feature, entity in zip(features, entity_values)
        ]

    def register_training_dataset(self,
                                  name="",
                                  label_source="",
                                  label_column="",
                                  features=None,
                                  entity_mappings=None):
        if name in self._training_sets:
            raise errors.DatasetExistsError(name)
        label_table = self.get_table(label_source)
        merged_table = self._join_feature_columns(label_table, features,
                                                  entity_mappings)
        required_columns = features + [label_column]
        training_dataset = merged_table.subtable(required_columns)
        self._training_sets[name] = training_dataset

    def generate_training_dataset(self, name):
        return self._training_sets[name].to_dataframe()

    def _join_feature_columns(self, label_table, feature_names,
                              entity_mappings):
        if entity_mappings is None:
            entity_mappings = []

        entity_to_clm = {
            mapping["entity"]: mapping["label_field"]
            for mapping in entity_mappings
        }
        features = [self._features[name] for name in feature_names]
        table_builder = label_table
        for feature in features:
            clm = feature.column()
            entity = feature.parent_entity()
            merge_key = entity_to_clm.get(entity)
            table_builder = table_builder.merge_column(clm, left_on=merge_key)
        return table_builder

    def _register_feature(self, feature_def):
        if feature_def.name in self._features:
            raise errors.FeatureExistsError(feature.name)
        feature = feature_def._instatiate(self)
        self._features[feature_def.name] = feature


class Table:
    """Table is an in-memory implementation of the StreamSQL table"""
    @classmethod
    def from_csv(cls, name, csv_file="", primary_key=None):
        """Create a Table from a CSV file."""
        dataframe = Table._dataframe_from_csv(csv_file, primary_key)
        return cls(name, dataframe)

    def __init__(self, name, dataframe):
        """Create a Table from a pandas.DataFrame"""
        self.name = name
        self._dataframe = dataframe

    def merge_column(self, clm, name=None, left_on=None):
        if name is None:
            name = uuid.uuid4()
        if left_on is None:
            merged_df = self._dataframe.merge(clm._series,
                                              left_index=True,
                                              right_index=True,
                                              suffixes=("_orig", ""))
        else:
            merged_df = self._dataframe.merge(clm._series,
                                              left_on=left_on,
                                              right_index=True,
                                              suffixes=("_orig", ""))
        return Table(name, merged_df)

    def lookup(self, key):
        """Lookup returns an array from a table by its primary key"""
        item_series = self._dataframe.loc[key]
        return item_series.to_list()

    def columns(self):
        return self._dataframe.columns

    def column(self, col_name):
        return Column(col_name, self._dataframe[col_name])

    def subtable(self, clms):
        return Table(self.name, self._dataframe[clms])

    def to_dataframe(self):
        return self._dataframe

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
        is_row_num_index = dataframe.index.name is None
        if not is_row_num_index:
            # By default, if an index column is given, its treated as a string.
            dataframe.index = dataframe.index.astype(str, copy=False)


class Column:
    def __init__(self, name, series):
        self._name = name
        if series.name != name:
            series.name = name
        self._series = series

    def __getitem__(self, key):
        return self._series.loc[key]

    def name(self):
        return self._name

    def transform(self, fn, name="", pass_column=False):
        if name == "":
            name = self._name
        kwargs = dict()
        if pass_column:
            kwargs["column"] = self
        copy = self._series.copy(deep=True)
        transformed = copy.transform(fn, **kwargs)
        return Column(name, transformed)

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

    def quantile(self, *quantiles):
        return self._series.quantile(quantiles)
