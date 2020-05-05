import math


class Numeric:
    def __init__(self,
                 name="",
                 table="",
                 column="",
                 operation=None,
                 parent_entity=None):
        self.name = name
        self.table = table
        self.column = column
        self.operation = operation
        self.parent_entity = parent_entity

    def _instatiate(self, sources):
        return _NumericFeature(self, sources)


class Sqrt:
    @classmethod
    def name(cls):
        return "sqrt"

    @classmethod
    def apply(cls, val):
        return math.sqrt(val)


class Pow:
    def __init__(self, factor):
        self._factor = factor

    def name(self):
        return "pow"

    def apply(self, val):
        return val**self._factor


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
        return self._apply_feature(init_value, column=column)

    def _apply_feature(self, init_value, column=None):
        return self._definition.operation.apply(init_value)
