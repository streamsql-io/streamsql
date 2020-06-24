import pandas as pd
import pytest
import numpy as np
import string
from streamsql.local import Column, Table


@pytest.fixture
def alphabet_table():
    data = zip(range(1, 27), string.ascii_lowercase)
    df = pd.DataFrame(data, columns=["position", "character"])
    return Table("alphabet", df)


@pytest.fixture
def count100clm():
    return Column("count100", pd.Series(range(1, 101)))


def test_lookup(alphabet_table):
    assert alphabet_table.lookup(3) == [4, 'd']


def test_clm_getitem(count100clm):
    assert count100clm[50] == 51


def test_clm_transform_rename(count100clm):
    identity = lambda x: x
    abc = count100clm.transform(identity, name="abc")
    assert count100clm.name() == "count100"
    assert abc.name() == "abc"


def test_clm_transform_pass_column(count100clm):
    shift_fn = lambda x, column: x - column.max()
    max_shifted = count100clm.transform(shift_fn, pass_column=True)
    expected = list(range(-99, 1))
    for i in range(100):
        assert max_shifted[i] == expected[i]


def test_clm_transform(count100clm):
    doubled = count100clm.transform(lambda x: x * 2)
    assert doubled[0] == 2
    assert count100clm[0] == 1


def test_clm_transform_sideeffects(count100clm):
    doubled = count100clm.transform(lambda x: x * 2)
    assert doubled[0] == 2
    assert count100clm[0] == 1


def test_clm_mean(count100clm):
    assert count100clm.mean() == 50.5


def test_clm_median(count100clm):
    assert count100clm.mean() == 50.5


def test_clm_std(count100clm):
    np.testing.assert_almost_equal(count100clm.std(), 29.0114, 4)


def test_clm_max(count100clm):
    assert count100clm.max() == 100


def test_clm_min(count100clm):
    assert count100clm.min() == 1


def test_clm_quantile(count100clm):
    actual = count100clm.quantile(0, .25, .5, .75, 1)
    expected = [1, 25.75, 50.5, 75.25, 100]
    assert (actual == expected).all()
