import pytest
import streamsql.local
import streamsql.errors
import os, sys

test_dir = os.path.dirname(os.path.realpath(__file__))
users_file = os.path.join(test_dir, 'testdata', 'users.csv')


@pytest.fixture
def feature_store():
    return streamsql.local.FeatureStore()


@pytest.fixture
def user_table(feature_store):
    return create_user_table(feature_store)


def create_user_table(feature_store):
    return feature_store.create_table_from_csv(users_file,
                                               table_name="users",
                                               primary_key="id")


def test_table_lookup(user_table):
    assert user_table.lookup("1") == ["simba"]


def test_table_lookup_fail(user_table):
    with pytest.raises(KeyError):
        user_table.lookup("abc")


def test_table_exists(feature_store):
    create_user_table(feature_store)
    with pytest.raises(streamsql.errors.TableAlreadyExists):
        create_user_table(feature_store)
