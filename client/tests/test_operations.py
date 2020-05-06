import pandas
import pytest
import streamsql.local
import streamsql.operation as op

@pytest.fixture
def int_column():
    data = [1,4,3,2,5]
    series = pandas.Series(data)
    return streamsql.local.Column("int_column", series)

@pytest.mark.parametrize(
    "min, max, transform",
    [(0, 1, (3, 0.5)), (-1, 1, (3, 0)), (-100, 100, (5, 100))]
)
def test_min_max(int_column, min, max, transform):
    scale = op.MinMax(min, max)
    initial, expected = transform
    actual = scale.apply(int_column, initial)
    assert actual == expected


def test_sqrt(int_column):
    assert op.Sqrt().apply(int_column, 4) == 2


@pytest.mark.parametrize("factor, transform", [(2, (2, 4)), (-1, (2, 0.5)),
                                               (3, (3, 27)), (0, (100, 1)),
                                               (0, (0, 1))])
def test_pow(int_column, factor, transform):
    initial, expected = transform
    assert op.Pow(factor).apply(int_column, initial) == expected
