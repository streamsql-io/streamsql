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


def test_table_already_exists(feature_store):
    create_user_table(feature_store)
    with pytest.raises(streamsql.errors.TableAlreadyExists):
        create_user_table(feature_store)


def test_has_table(feature_store):
    create_user_table(feature_store)
    assert feature_store.has_table("users")


def test_not_has_table(feature_store):
    create_user_table(feature_store)
    assert not feature_store.has_table("users2")


def test_get_table(feature_store):
    created_table = create_user_table(feature_store)
    got_table = feature_store.get_table("users")
    assert created_table == got_table


def test_get_table_fail(feature_store):
    with pytest.raises(KeyError):
        feature_store.get_table("users2")


def test_table_lookup(user_table):
    assert user_table.lookup("1") == ["simba"]


def test_table_lookup_fail(user_table):
    with pytest.raises(KeyError):
        user_table.lookup("abc")


