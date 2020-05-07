import os
import pytest
import streamsql.local
import streamsql.feature as feature
import streamsql.operation as op

test_dir = os.path.dirname(os.path.realpath(__file__))
testdata_dir = os.path.join(test_dir, 'testdata')
numeric_tester_file = os.path.join(testdata_dir, 'numeric_tester.csv')


@pytest.fixture
def feature_store():
    return streamsql.local.FeatureStore()


def create_numeric_tester_table(feature_store):
    return feature_store.create_table_from_csv(numeric_tester_file,
                                               table_name="numeric_tester",
                                               primary_key="id")


def test_numeric_feature(feature_store):
    create_numeric_tester_table(feature_store)
    feature_store.register_features(
        feature.Numeric(
            name="do-everything",
            table="numeric_tester",
            column="value",
            transform=op.Pow(2),
            normalize=op.MinMax(min=0, max=4),
            fill_missing=op.Mean(),
            truncate=op.QuantileTrunc(bottom=0.2),
            parent_entity="id",
        ))
    inputs = feature_store.online_features(["do-everything"],
                                           entities={"id": "3"})
    assert inputs == [4]
