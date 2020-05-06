import math


class Sqrt:
    @classmethod
    def name(cls):
        return "sqrt"

    @classmethod
    def apply(cls, column, val):
        return math.sqrt(val)


class Pow:
    def __init__(self, factor):
        self._factor = factor

    def name(self):
        return "pow"

    def apply(self, column, val):
        return val**self._factor
