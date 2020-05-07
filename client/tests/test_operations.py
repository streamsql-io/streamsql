import pandas
import pytest
import streamsql.local
import streamsql.operation as op


@pytest.fixture
def int_column():
    data = [1, 4, 3, 2, 5, 5]
    series = pandas.Series(data)
    return streamsql.local.Column("int_column", series)


@pytest.mark.parametrize("initial, expected",
                         [(3, 3), (100, 4.9663264951887856), (2, 2),
                          (-1, 1.7003401714778814)])
def test_zscore_cap(int_column, initial, expected):
    assert op.ZScoreTrunc(1).apply(int_column, initial) == expected


@pytest.mark.parametrize("initial, expected", [(3, 3), (100, 3.5), (2, 2),
                                               (-1, 1)])
def test_quantile_cap(int_column, initial, expected):
    assert op.QuantileTrunc(top=0.5).apply(int_column, initial) == expected


@pytest.mark.parametrize("min, max, transform", [(0, 1, (3, 0.5)),
                                                 (-1, 1, (3, 0)),
                                                 (-100, 100, (5, 100))])
def test_min_max(int_column, min, max, transform):
    scale = op.MinMax(min, max)
    initial, expected = transform
    actual = scale.apply(int_column, initial)
    assert actual == expected


@pytest.mark.parametrize("initial, expected", [(3 + 1 / 3, 0),
                                               (100, 59.19600211726014)])
def test_z_score(int_column, initial, expected):
    assert op.ZScore().apply(int_column, initial) == expected


def test_sqrt(int_column):
    assert op.Sqrt().apply(int_column, 4) == 2


@pytest.mark.parametrize("factor, transform", [(2, (2, 4)), (-1, (2, 0.5)),
                                               (3, (3, 27)), (0, (100, 1)),
                                               (0, (0, 1))])
def test_pow(int_column, factor, transform):
    initial, expected = transform
    assert op.Pow(factor).apply(int_column, initial) == expected


def test_median(int_column):
    assert op.Median().apply(int_column, float('nan')) == 3.5


def test_mean(int_column):
    assert op.Mean().apply(int_column, float('nan')) == 3 + 1 / 3


def test_zero(int_column):
    assert op.Zero().apply(int_column, float('nan')) == 0
