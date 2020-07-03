import pandas as pd
import pytest
import numpy as np
import string
from streamsql.local import Column, Table


@pytest.fixture
def alphabet_table():
    data = zip(range(1, 27), string.ascii_lowercase, string.ascii_uppercase)
    df = pd.DataFrame(data, columns=["position", "lower", "upper"])
    return Table("alphabet", df)


@pytest.fixture
def count100clm():
    return Column("count100", pd.Series(range(1, 101)))


def test_columns(alphabet_table):
    assert (alphabet_table.columns() == ["position", "lower", "upper"]).all()


def test_lookup(alphabet_table):
    assert alphabet_table.lookup(3) == [4, 'd', 'D']


def test_subtable(alphabet_table):
    assert alphabet_table.subtable(["lower", "upper"]).lookup(3) == ['d', 'D']


def test_merge_by_clm(alphabet_table):
    index = reversed(string.ascii_lowercase)
    series = pd.Series(range(0, 26), index=index)
    new_col = Column("reverse", series)
    merged = alphabet_table.merge_column(new_col, left_on="lower")
    assert merged.lookup(3) == [4, 'd', 'D', 22]


def test_merge_by_idx(alphabet_table):
    new_col = Column("idx", pd.Series(range(0, 26)))
    merged = alphabet_table.merge_column(new_col)
    assert merged.lookup(3) == [4, 'd', 'D', 3]


def test_merge_gen_name(alphabet_table):
    new_col = Column("idx", pd.Series(range(0, 26)))
    merged = alphabet_table.merge_column(new_col)
    assert merged.name() != "alphabet"


def test_merge_w_rename(alphabet_table):
    new_col = Column("lower", pd.Series(range(0, 26)))
    merged = alphabet_table.merge_column(new_col, name="new_table")
    assert merged.name() == "new_table"


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
