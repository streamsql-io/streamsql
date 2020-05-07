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
        return _NumericFeature(self, sources)


class _NumericFeature:
    def __init__(self, definition, sources):
        self._definition = definition
        self._sources = sources

    def parent_entity(self):
        return self._definition.parent_entity

    def lookup(self, entity):
        table = self._sources.get_table(self._definition.table)
        column = table.column(self._definition.column)
        init_value = column[entity]
        return self._apply_feature(column, init_value)

    def _apply_feature(self, column, init_value):
        d = self._definition
        fn_order = (d.fill_missing, d.truncate, d.normalize, d.transform)
        cur_value = init_value
        for fn in fn_order:
            if fn is None:
                continue
            cur_value = fn.apply(column, cur_value)
        return cur_value
