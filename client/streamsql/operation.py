import math


class NoOp:
    @classmethod
    def name(cls):
        return "no_op"

    @classmethod
    def apply(cls, column, value):
        return value


class MinMax:
    """MinMax linearly scales a feature to fit between a min and max"""
    def __init__(self, min=0, max=1):
        self._min = min
        self._max = max
        self._range = max - min

    def name(self, name):
        return "min_max"

    def apply(self, column, value):
        clm_max = column.max()
        clm_min = column.min()
        clm_range = clm_max - clm_min
        # Transform value to what it would be if the column was scaled from zero
        # to one.
        zero_to_one = (value - clm_min) / clm_range
        # Transform value to what it would be if the column was scaled from zero
        # to this MinMax range.
        scaled = zero_to_one * self._range
        # Shift value so that it starts at the minimum.
        return scaled + self._min


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
