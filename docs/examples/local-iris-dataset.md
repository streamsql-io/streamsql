# \(Local\) Iris Dataset

## Introduction

This example will build out features and train a simple logistic regression to classify flowers. We will use the Iris data set to this purpose. We will highlight how StreamSQL can be used locally. The local version will store and process all data on the machine it is run on.

### The Iris Dataset

The Iris dataset can be found [here](https://archive.ics.uci.edu/ml/datasets/iris). It contains 150 rows in a CSV with five columns. The columns are: sepal length, `sepal width`, `petal length,` `pedal width`, and `species`. The four length and width columns are numerical, whereas the species column is a categorical string with three possible values: `setosa`, `versicolor`, and `virginica`.

### Strategy

We will use [z-score normalization](https://en.wikipedia.org/wiki/Standard_score) on each of the numerical columns to turn them into features and then feed them into the [logistic regression implementation in scikit learn](https://en.wikipedia.org/wiki/Standard_score).

## The Model

### Set up the Environment

Make sure that Python and PIP are installed on your local machine. Next, install StreamSQL's Python client using pip. Check out the [Getting Started](../getting-started.md) section for a more thorough walk though in setting up StreamSQL on your machine.

```bash
pip install streamsql
```

The iris dataset can be downloaded [here](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data). The downloaded file is named `iris.data` and should be moved to your working directory.

### Load the data into StreamSQL

 We can initialize a local feature store instance and then connect the iris dataset to it. The `LocalFeatureStore` does not require an API key and does not upload to a server, as its made for local development. When uploading the file, we have to specify the format as CSV since it's not implied by the .data ending.

```python
from streamsql.local import LocalFeatureStore

feat = LocalFeaturestore()
cols = ["sepal_w", "sepal_l", "petal_w", "petal_l", "species"]
table = feat.upload_file(
    "./iris.data",
    name="iris",
    format="csv",
    columns=cols,
)
```

{% hint style="warning" %}
upload\_file makes a local copy of the file to guarantee immutability. That means that changes to the file will not be reflected in the new table.
{% endhint %}

### Define the Model Features

Our model features are the same as the first four columns in the CSV with z-score normalization applied.

```python
from streamsql.operation import ZScore
from streamsql.feature import NumericFeature

# The features are the same as the CSV columns, excluding species.
features = cols[:-1]
for col in features:
    feat.register_feature(
        NumericFeature(
            name=col,
            table=table,
            column=col,
            normalization=ZScore(),
        ),
    )
```

### Generate a Training Dataset

```python
dataset = feat.register_training_dataset(
    name="iris",
    label_table=table,
    label_field="species",
    features=features,
)
train, test = dataset.generate_training_data(
    training_size=0.9, test_size=0.1, shuffle=True,
)
```

### Train and Validate Model

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression().fit(train.X, train.y)
# Validate that the model's performance against the training and testing data.
print(model.score(train.X, train.y))
print(model.score(test.X, test.y))
```

## Full Example

```python
from streamsql.local import LocalFeatureStore
from streamsql.operation import ZScore
from streamsql.feature import NumericFeature
from sklearn.linear_model import LogisticRegression

feat = LocalFeaturestore()
cols = ["sepal_w", "sepal_l", "petal_w", "petal_l", "species"]
table = feat.upload_file(
    "./iris.data",
    name="iris",
    format="csv",
    columns=cols,
)
features = cols[:-1]
for col in features:
    feat.register_feature(
        NumericFeature(
            name=col,
            table=table,
            column=col,
            normalization=ZScore(),
        ),
    )
dataset = feat.register_training_dataset(
    name="iris",
    label_table=table,
    label_field="species",
    features=features,
)
train, test = dataset.generate_training_data(
    training_size=0.9, test_size=0.1, shuffle=True,
)
```

