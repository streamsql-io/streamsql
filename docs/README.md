# Introduction

StreamSQL is a feature store for machine learning.

**StreamSQL accelerates machine learning development by:**

1. Generating model features for serving using declarative definitions
2. Generating training sets using the same feature definitions as serving
3. Versioning, monitoring, and managing features
4. Allowing features to be shared, re-used, and discovered features across teams and models

## How it works

The general workflow to getting the feature store up and running is to:

1. Connect your data sources or upload data directly to StreamSQL
2. Optionally transform and join your data using SQL
3. Register your feature definitions
4. Serve features in production or generate training datasets from your labels

At any point, you can also:

* Add new data sources or transformations
* Create or evolve features
* Analyze and discover features in the feature registry

## Why to use StreamSQL

### Guarantee consistent features between training and serving

 StreamSQL allow new model features to be deployed confidently and with ease. It uses the feature definitions that you declare to generate training datasets and to serve the same features in production. This removes all the time spent re-engineering model pipelines to generate the serving features, and removes a class of bugs stemming from inconsistent features in serving and production.

### Maintain a single source of truth for features

StreamSQL allows organizations to keep a repository of versioned features. It's common for multiple models to require essentially the same features. Without a central feature repository, teams will have to build and maintain their own feature generation pipelines. This can lead to a large amount of inconsistent features trying to model the same thing, and tons of wasted time and repeated effort.

### Share and re-use features across teams and models

StreamSQL allows feature engineering advancements made by one team to be shared by others. Feature engineering is a creative and time-consuming effort. By treating features as building blocks for your models, teams can share and re-use features to increase model performance across the organization.

### Unify stream and batch processing for feature generation

StreamSQL allows machine learning teams to think at a higher level of abstraction then is possible with Flink and Spark. Files, tables, and streams can be connected to StreamSQL and then transformed and joined using SQL before being turned into features. Once the data is prepared features may be defined declaratively and StreamSQL will handle generating them for training and serving.

### Manage your feature development with built-in versioning

Good feature management simplifies and accelerates the machine learning process. Features are defined with a consistent interface in a central repository. Anyone can dig into how a feature is being generated and depend on a specific version without breaking changes. Using the feature registry UI, you can quickly understand the features datatype and statistical properties.

