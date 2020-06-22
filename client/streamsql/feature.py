import streamsql.operation as op
import math


class Numeric:
    def __init__(self,
                 name="",
                 table="",
                 column="",
                 transform=None,
                 normalize=None,
                 truncate=None,
                 fill_missing=None,
                 parent_entity=None):
        self.name = name
        self.table = table
        self.column = column
        self.transform = transform
        self.normalize = normalize
        self.truncate = truncate
        self.fill_missing = fill_missing
        self.parent_entity = parent_entity

    def _instatiate(self, sources):
        column = sources.get_table(self.table).column(self.column)
        return _NumericFeature(self, column)


class _NumericFeature:
    def __init__(self, definition, column):
        self._def = definition
        self._source_column = column
        self._column = self._transformed_column(column)

    def name(self):
        return self._def.name

    def column(self):
        return self._column

    def source_column(self):
        return self._source_column

    def parent_entity(self):
        return self._def.parent_entity

    def lookup(self, entity):
        return self._column[entity]

    def _transformed_column(self, column):
        transformed = column.transform(self._apply_feature)
        transformed.rename(self._def.name)
        return transformed

    def _apply_feature(self, init_value, column):
        d = self._def
        fn_order = (d.fill_missing, d.truncate, d.normalize, d.transform)
        cur_value = init_value
        for fn in fn_order:
            if fn is None:
                continue
            cur_value = fn.apply(column, cur_value)
        return cur_value
