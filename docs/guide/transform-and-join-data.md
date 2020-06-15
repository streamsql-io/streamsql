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

{% hint style="warning" %}
You must define your dependencies and output\_columns. StreamSQL does not currently support implicitly defining them in the SQL.
{% endhint %}

## Group By

Streams can be transformed into aggregate tables using a `GROUP BY` transformation. In this situation, the `materialize_table` call should be used since we're creating a table from the stream. This is a common way to prepare streaming data for use in model features.

```python
streamsql.materialize_table(
	name="purchase_count",
	query="SELECT user, COUNT(*) FROM purchases GROUP BY user",
	dependencies=["purchases"],
	output_columns=["user", "cnt"],
)
```

### Grouping Items into an Array

`GROUP BY`'s can be used to generate arrays of items using the `collect` function. For example, if I was to create a model feature that is an array of all a user's purchases, I can do that as follows:

```python
streamsql.materialize_table(
	name="purchase_count",
	query="SELECT user, COLLECT(item) FROM purchases GROUP BY user",
	dependencies=["purchases"],
	output_columns=["user", "items"],
)
```

## Joining a Stream and a File

A `JOIN` between two tables or across a table and a stream are supported. This allows for streams to be enriched with immutable tables like CSV files. For example, we can enrich the stream with the price of the item as follows:

```python
streamsql.materialize_stream(
	name="enriched_purchases",
	query="SELECT p.id, p.user, p.item, catalog.price " +
		"FROM purchases p INNER JOIN catalog ON p.item = catalog.id",
	dependencies=["purchases", "catalog"],
	output_columns=["id", "user", "item", "price"],
)
```

{% hint style="warning" %}
A `JOIN`between two streams or using any dynamic tables are currently unsupported.
{% endhint %}

