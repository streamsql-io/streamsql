# API Overview

## Architecture

StreamSQL has three core APIs: Data, Features, and Training. These APIs are layered. The training APIs depend on the features that are registered in the Feature API, and the Feature API depends on columns defined by the Data API.

StreamSQL takes in data from a variety of sources including Kafka, HDFS, and directly through REST calls. This data can be transformed and joined using SQL to create materialized views. Features are then defined on top of these data layer which provides built-in versioning and common feature engineering operations like scaling. Features can be served directly from the Feature API, and, by defining where your labels are, StreamSQL can generate training data for you as well.

## Data API

### Upload Data

StreamSQL stores all of the data it uses. You can upload data directly in Python or point us at data sources to consume from like HDFS, Kafka, and more. If you use a stream like Kafka, then StreamSQL will store all historical events by default. This allows us to backfill stateful features that depend on the stream.

{% page-ref page="connect-and-upload-data.md" %}

### Materialize Views using SQL

StreamSQL allows you to generate new tables and streams from your sources using SQL. This can be used to do any data preparation or cleaning that is required before generating features from the data. These materialized views can also be created from joining two sources. It can even join a data stream and a file.

{% page-ref page="transform-and-join-data.md" %}

## Feature API

The feature API allows you to define your features. It has built-in options for a wide variety of feature engineering techniques including filling missing values, scaling values down, one-hot encoding, and more. Every feature depends on columns from streams or tables that are defined in the Data API. They can also depend on materialized views, so that certain transformations can be performed in the data layers.

{% hint style="info" %}
If a transformation only makes sense in a machine learning context, perform the operation in the Feature API \(ex. set missing values to the median\). If it's a reasonable thing to do in a database, such as breaking a date string into different columns, then do it using the data API.
{% endhint %}

{% page-ref page="register-and-serve-features.md" %}

## Training API

The training API allows you to generate training datasets. A training dataset is made up of a set of features and a label. A label is the observed outcome that we want to train the model to predict. For example, if we want a model to predict housing prices, then the label would be the actual price the house. Labels may be time dependent, for example a house may be sold multiple times over the years at different prices. In this case, the training dataset should include the features at the point-in-time of the label.

StreamSQL handles all of these details for you. By specifying the table or stream that contains your labels, entities, and optionally timestamps along with a set of features, a training dataset will be automatically generated for you. You can specify the format that you'd like to handle the data in and optionally provide some rules around sampling.

{% page-ref page="generate-training-data.md" %}

