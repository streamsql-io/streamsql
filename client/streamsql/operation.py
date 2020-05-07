import math
from abc import ABCMeta, abstractmethod


class ZScoreTrunc:
    def __init__(self, max_devs=3):
        self._max_devs = max_devs
        self._zscore = ZScore()

    def apply(self, column, value):
        zscore = self._zscore.apply(column, value)
        capped_zscore = _cap(zscore, -self._max_devs, self._max_devs)
        return self._zscore.revert(column, capped_zscore)


class QuantileTrunc:
    def __init__(self, bottom=0, top=1):
        self._bottom = bottom
        self._top = top

    def apply(self, column, value):
        bottom_val, top_val = column.quantile(self._bottom, self._top)
        return _cap(value, bottom_val, top_val)


class FillMissingOp(metaclass=ABCMeta):
    def apply(self, column, value):
        if math.isnan(value):
            return self.fill_value(column)
        return value

    @abstractmethod
    def fill_value(self, column):
        pass


class NoOp:
    def name(self):
        return "no_op"

    def apply(self, column, value):
        return value


class Median(FillMissingOp):
    def name(self):
        return "median"

    def fill_value(self, column):
        return column.median()


class Mean(FillMissingOp):
    def name(self):
        return "mean"

    def fill_value(self, column):
        return column.mean()


class Zero(FillMissingOp):
    def name(self):
        return "zero"

    def fill_value(self, column):
        return 0


class ZScore:
    def name(self):
        return "z_score"

    def apply(self, column, value):
        return (value - column.mean()) / column.std()

    def revert(self, column, value):
        return value * column.std() + column.mean()


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
    def name(self):
        return "sqrt"

    def apply(self, column, val):
        return math.sqrt(val)


class Pow:
    def __init__(self, factor):
        self._factor = factor

    def name(self):
        return "pow"

    def apply(self, column, val):
        return val**self._factor


def _cap(value, lower, upper):
    if value > upper:
        return upper
    elif value < lower:
        return lower
    else:
        return value
