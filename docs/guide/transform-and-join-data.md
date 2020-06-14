# Transform and Join Data

## Materialized Views

Users can use SQL to generate new tables or streams from existing ones. These generated data sources can be used like other data sources. Materialized views can be a transformation on a single table or stream, a join of a table and a stream, a union of multiple tables, or even joining multiple different sources.

## Basic Transformation

Materialized views can be created to maintain different subsets to build features upon. For example, let's say I have a stream named `purchases` that has the columns `user, item, state` and I would like to create CA specific features. I can create a materialized view for California purchases as follows:

```python
streamsql.materialize_stream(
	name="ca_purchases",
	query="SELECT id, user, item FROM purchases WHERE state = 'CA'",
	dependencies=["purchases"],
	output_columns=["user", "item"],
)
```

`name` is the name of the materialized stream and can used in the same way that a normal source stream can be used, except that you can not directly write to it. `query` defines the SQL transformation to apply on the `dependencies` that are listed. `output_columns` allow columns to be renamed.

{% hint style="info" %}
You must define your dependencies and output\_columns. StreamSQL does not currently support implicitly defining them in the SQL.
{% endhint %}

## Group By

Materialized views can be created to maintain different subsets to build features upon. For example, let's say I have a stream named `purchases` that has the columns `user, item, state` and I would like to create CA specific features. I can create a materialized view for California purchases as follows:

```python
streamsql.materialize_stream(
	name="ca_purchases",
	query="SELECT id, user, item FROM purchases WHERE state = 'CA'",
	dependencies=["purchases"],
	output_columns=["user", "item"],
)
```

`name` is the name of the materialized stream and can used in the same way that a normal source stream can be used, except that you can not directly write to it. `query` defines the SQL transformation to apply on the `dependencies` that are listed. `output_columns` allow columns to be renamed.

{% hint style="info" %}
You must define your dependencies and output\_columns. StreamSQL does not currently support implicitly defining them in the SQL.
{% endhint %}

## Grouping Items an Array

## Joining a Stream and a File



