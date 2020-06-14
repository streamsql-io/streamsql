# Connect and Upload Data

## Uploading directly from Python

Data can be uploaded via the Python API. If your data exists in HDFS, Kafka, or another data source, it may be preferable to use [connectors](connect-and-upload-data.md#connecting-external-data-sources).

### Streaming Data

#### Create a Stream

Create a named stream to start sending events to it. By default a stream will retain its events forever; however, its retention behavior may be changed with the `retention_policy` parameter.

```python
stream = streamsql.source.create_stream(name="MyStream")
```

#### Upload Event

Events may be uploaded to the stream. Their timestamp is set to the time the event reaches the StreamSQL server. By default, the events payload is converted into JSON, but you may specify the formatting.

```python
stream.upload({"key": "value"}, format="json")
```

### Dynamic Tables

Mutable tables are schema-less keyed tables. Items may be inserted and retrieved by key, and the table may be projected into another mutable table using a [transformation](transform-and-join-data.md).

```python
table = streamsql.source.create_table(
    name="MyTable",
    primary_key="id",
)
table.insert({"id": "user1", "first_name": "simba", "last_name": "khadder"})
table.get("user1")
```

{% hint style="danger" %}
Dynamic Tables may not be used in joins and may not be versioned.
{% endhint %}

### Immutable Tables

Like [Dynamic Tables](connect-and-upload-data.md#dynamic-tables), Immutable Tables are schema-less keyed tables. They may be initialized with all of their data included. They may also be initialized via a dynamic table then turned into immutable with `table.make_immutable(version=1)`. If the data exists in a file or database table, you should use the [connector APIs](connect-and-upload-data.md#files).

```python
table = streamsql.source.create_table(
    name="MyTable",
    primary_key="id",
    data=[{"id": "user1", "first_name": "simba", "last_name": "khadder"}].
    immutable=True,
    version=1,
)
table.get("user1")
```

## Connecting External Data Sources

### Files

Immutable tables may be created from files. In this case, the file is pulled and copied into StreamSQL. You can create the same table with a new version if the file changes.

```python
streamsql.connector.upload_file(
    "hdfs://data/users.csv",
    name="users",
    primary_key="id",
)
```

### Streams

Kafka streams may be uploaded directly into a StreamSQL stream. In this case, we will start reading from Kafka at its earliest messages and retain all messages indefinitely in StreamSQL to power our backfilling.

```python
streamsql.connector.upload_kafka(
    brokers=["localhost:9092"],
    name="transactions",
    format="json",
)
```



