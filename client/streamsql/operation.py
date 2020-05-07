import math


class ZScoreCap:
    def __init__(self, max_devs=3):
        self._max_devs = max_devs

    def apply(self, column, value):
        zscore = ZScore.apply(column, value)
        capped_zscore = _cap(zscore, -self._max_devs, self._max_devs)
        return ZScore.revert(column, capped_zscore)


class QuantileCap:
    def __init__(self, bottom=0, top=1):
        self._bottom = bottom
        self._top = top

    def apply(self, column, value):
        bottom_val, top_val = column.quantile(self._bottom, self._top)
        return _cap(value, bottom_val, top_val)


class NoOp:
    @classmethod
    def name(cls):
        return "no_op"

    @classmethod
    def apply(cls, column, value):
        return value


class Median:
    @classmethod
    def name(cls):
        return "median"

    @classmethod
    def apply(cls, column, *ignore):
        return column.median()


class Mean:
    @classmethod
    def name(cls):
        return "mean"

    @classmethod
    def apply(cls, column, *ignore):
        return column.mean()


class Zero:
    @classmethod
    def name(cls):
        return "zero"

    @classmethod
    def apply(cls, column, *ignore):
        return 0


class ZScore:
    @classmethod
    def name(cls):
        return "z_score"

    @classmethod
    def apply(cls, column, value):
        return (value - column.mean()) / column.std()

    @classmethod
    def revert(cls, column, value):
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


def _cap(value, lower, upper):
    if value > upper:
        return upper
    elif value < lower:
        return lower
    else:
        return value
