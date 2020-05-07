import pytest
import streamsql.local
import streamsql.errors
import streamsql.feature
import streamsql.operation
import os
import pandas as pd

test_dir = os.path.dirname(os.path.realpath(__file__))
testdata_dir = os.path.join(test_dir, 'testdata')
users_file = os.path.join(testdata_dir, 'users.csv')
purchases_file = os.path.join(testdata_dir, 'purchases.csv')


@pytest.fixture
def feature_store():
    return streamsql.local.FeatureStore()


@pytest.fixture
def users_table(feature_store):
    return create_users_table(feature_store)


@pytest.fixture
def purchases_table(feature_store):
    return create_purchases_table(feature_store)


def create_users_table(feature_store):
    return feature_store.create_table_from_csv(users_file,
                                               table_name="users",
                                               primary_key="id")


def create_purchases_table(feature_store):
    return feature_store.create_table_from_csv(purchases_file,
                                               table_name="purchases",
                                               primary_key="id")


def test_table_already_exists(feature_store):
    create_users_table(feature_store)
    with pytest.raises(streamsql.errors.TableExistsError):
        create_users_table(feature_store)


def test_has_table(feature_store):
    create_users_table(feature_store)
    assert feature_store.has_table("users")


def test_not_has_table(feature_store):
    create_users_table(feature_store)
    assert not feature_store.has_table("users2")


def test_get_table(feature_store):
    created_table = create_users_table(feature_store)
    got_table = feature_store.get_table("users")
    assert created_table == got_table


def test_get_table_fail(feature_store):
    with pytest.raises(KeyError):
        feature_store.get_table("users2")


def test_table_lookup(users_table):
    assert users_table.lookup("1") == ["simba", 123]


def test_table_lookup_fail(users_table):
    with pytest.raises(KeyError):
        users_table.lookup("abc")


def test_table_simple_sql(feature_store):
    create_users_table(feature_store)
    table_name = "nora_table"
    nora_table = feature_store.materialize_table(
        name=table_name,
        query="SELECT id, name FROM users WHERE name == 'nora'",
        dependencies=["users"],
        output_columns=["new_id", "new_name"],
        primary_key=["new_id"],
    )
    df = pd.DataFrame(["nora"], index=["2"], columns=["new_name"])
    df.index.name = "new_id"
    expected = streamsql.local.Table(table_name, df)
    assert nora_table == expected


def test_table_join_sql(feature_store):
    create_users_table(feature_store)
    create_purchases_table(feature_store)
    table_name = "dollars_spent"
    dollars_spent_table = feature_store.materialize_table(
        name=table_name,
        query="""SELECT user.id, SUM(price) FROM purchases purchase
        INNER JOIN users user ON purchase.user=user.id GROUP BY user.id
        ORDER BY user.id ASC
        """,
        dependencies=["users", "purchases"],
        output_columns=["user", "spent"],
        primary_key=["user"],
    )
    df = pd.DataFrame([1000, 10], index=["1", "3"], columns=["spent"])
    df.index.name = "user"
    expected = streamsql.local.Table(table_name, df)
    assert dollars_spent_table == expected


def test_materialized_table_is_stored(feature_store):
    create_users_table(feature_store)
    created = feature_store.materialize_table(
        name="user_cpy",
        query="SELECT id, name FROM users",
        dependencies=["users"],
        output_columns=["id", "name"],
        primary_key=["id"],
    )
    assert feature_store.has_table("user_cpy")
    got = feature_store.get_table("user_cpy")
    assert created == got


def test_numeric_feature(feature_store):
    create_users_table(feature_store)
    feature = streamsql.feature.Numeric(
        name="sq_balance",
        table="users",
        column="balance",
        transform=streamsql.operation.Pow(2),
        parent_entity="user",
    )
    feature_store.register_features(feature)
    inputs = feature_store.online_features(["sq_balance"],
                                           entities={"user": "1"})
    assert inputs == [123**2]


def test_noop_feature(feature_store):
    create_users_table(feature_store)
    feature = streamsql.feature.Numeric(
        name="balance",
        table="users",
        column="balance",
        parent_entity="user",
    )
    feature_store.register_features(feature)
    inputs = feature_store.online_features(["balance"], entities={"user": "1"})
    assert inputs == [123]
