# Getting Started

## Prerequisites

The cloud hosted version of StreamSQL requires an API key.

1. [Create a StreamSQL account](https://streamsql.io/register)
2. Get your [API key](https://streamsql.io/register)
3. Make sure you have [Python 3.5 or above installed](https://www.python.org/downloads/) on your machine 

## Install the Python SDK

The easiest way to install the Python SDK for Python is to use [pip](https://pip.pypa.io/en/latest/).

```bash
pip install streamsql
```

{% hint style="warning" %}
Our library is available for Python 3. On some installations you may have to use pip3 rather than pip.
{% endhint %}

## Initialize the Client

{% tabs %}
{% tab title="Cloud" %}
```python
feats = streamsql.FeatureStore(apikey="YOUR API KEY")
```
{% endtab %}

{% tab title="Local" %}
```python
feats = streamsql.Local()
```
{% endtab %}

{% tab title="Managed" %}
```python
feats = streamsql.Managed(
    host="SERVER HOSTNAME",
    port=PORT NUMBER,
)
```
{% endtab %}
{% endtabs %}

## Where to go from here

If you would like to jump into the basics of the API and how to use it, check out the API overview.

{% page-ref page="guide/api-overview.md" %}

If you would prefer to jump directly into an example, check out one of the following:

{% page-ref page="examples/fraud-detection.md" %}

{% page-ref page="examples/recommender-system.md" %}

{% page-ref page="examples/sentiment-analysis.md" %}

We also have an example of using StreamSQL locally.

{% page-ref page="examples/local-iris-dataset.md" %}

