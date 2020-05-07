import streamsql.operation as op


class Numeric:
    def __init__(self,
                 name="",
                 table="",
                 column="",
                 transform=op.NoOp,
                 parent_entity=None):
        self.name = name
        self.table = table
        self.column = column
        self.transform = transform
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
        return self._definition.operation.apply(column, init_value)
