import math


class NoOp:
    @classmethod
    def name(cls):
        return "no_op"

    @classmethod
    def apply(cls, column, value):
        return value


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
