# Register and Serve Features

## Introduction

### What is a feature?

Machine learning models take input values to predict an output. The inputs are named features. The goal of a feature is to provide a model context required to make a good prediction. Most models cannot perform well with a dump of raw data. For example, a model provided all the text in an article would not be able to do well. It's common to pre-process the data and even transform it into numeric inputs for the model to use.

### Types of Feature Engineering

#### Clean Inputs for the Model

Many models need their inputs standardized to do well. Models like neural networks tend to over-react or under-react to huge outliers in data. Given how gradient descent works, models may perform poorly when their features have widely different ranges. Lots of feature engineering techniques are focused on standardizing data and keeping it in a clean range to make sure that the model behaves rationally. These techniques include scaling features, filling missing values, and truncating outliers.

#### Imbue Domain Knowledge

Models benefit from features that imbue domain knowledge. For example, a fraud detection model that works by only reading transaction events will likely under perform one that's provided the transaction along with the number of past transactions by the user, the average purchase price of all transaction, and the card issuers credibility. This feature engineering may also be as simple as providing a map of the word frequencies in a document rather than the entire document text.

#### Encode Inputs for Model Compatibility

Some models simply cannot take data of certain data types. For example, neural networks cannot directly ingest strings. In these cases, we may encode the incompatible value using a variety of techniques such as one-hot encoding or binning.

## Feature Definition

Feature definitions are defined using the `FeatureDef` object. They are then registered using the `register_feature` method of a `FeatureStore` object. A feature maps directly to a single table column defined in the [Data API](connect-and-upload-data.md), this includes [materialized views](transform-and-join-data.md).

## Feature Operations

### transformation

Transformations are applied on each element individually. They are a mapping function. Custom python functions are supported here, and there are a few built-in ones as well:

* **Sqrt\(\)**: Returns $$\sqrt{x}$$ 
* **Pow\(n\)**: Returns $$x^n$$ 
* **TFIDF\(\):** Applies [TF-IDF](https://streamsql.io/blog/tf-idf-from-scratch) to turn text into a numeric vector.
* **UnitVec\(\)**: Scales a vector so that it has a magnitude of 1
* **OneHotEnc\(\):** Performs one-hot encoding on a categorical value
* **Map\(m, default=None\):** Returns m\[x\]

### normalize

Normalizing is a way to scale a feature's value range. This type of operation can only be applied to numeric columns. There are two kinds of supported normalization operations:

* **MinMax:** Linearly scales everything down to fit between a min and max value.
* **ZScore:** Z-Score normalization is defined as  $$y = \frac{x-\mu}{\sigma}$$ where x is the original value, $$\mu$$ is the mean, and $$\sigma$$ is the standard deviation. 

### binning

### fill\_missing

### truncate

## Serving Features

### Entity Mappings

## Examples

