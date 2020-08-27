export const resourceTypes = Object.freeze({
  DATA_SOURCE: "Data Source",
  MATERIALIZED_VIEW: "Materialized View",
  FEATURE: "Feature",
  FEATURE_SET: "Feature Set",
  TRAINING_SET: "Training Set",
});

export default class ResourcesAPI {
  fetchResources(type) {
    const data = {
      [resourceTypes.DATA_SOURCE]: [
        {
          name: "catalog",
          description:
            "A CSV dump in HDFS of all the items we sell and their meta-data.",
          tags: ["Table", "Backend"],
          versions: ["9", "8", "7", "4", "1"],
          language: "python",
          config: `upload_file(file="hdfs://item_catalog.csv", primary_key="id")`,
        },
        {
          name: "purchases",
          description:
            "A Kafka stream that's triggered when a user purchases an item. Note that this is a separate event from when we actually charge their card.",
          tags: ["Stream", "UserEvent"],
          versions: ["1"],
          language: "python",
          config: `upload_kafka(topic="purchases", fmt="json")`,
        },
        {
          name: "charges",
          description:
            "A Kafka stream that's written to when we actually charge the card. It lets us know if the charge was declined or if it was fraudulent.",
          tags: ["Stream", "Backend"],
          versions: ["1"],
          language: "python",
          config: `upload_kafka(topic="charges", fmt="json")`,
        },
      ],
      [resourceTypes.MATERIALIZED_VIEW]: [
        {
          name: "AvgPurchasePrice",
          description:
            "An aggregate of the average a user spends per item. It joins the purchases stream with the item catalog CSV.",
          tags: ["Streaming"],
          versions: ["1"],
          language: "sql",
          config: `SELECT p.user,
       AVG(catalog.price)
FROM   purchases p
       INNER JOIN catalog
          ON p.item = catalog.id`,
        },
      ],
      [resourceTypes.FEATURE]: [
        {
          name: "LogAvgPurchasePrice",
          description:
            "A normalized feature representing the average price a user spends per purchase. This value is based on a stream, so it will continue to update and change.",
          tags: ["UserFeature", "Transaction"],
          versions: ["2", "1"],
          language: "json",
          config: `{
  "table": "AvgPurchasePrice",
  "column": "price",
  "fill_missing": Median(),
  "normalization": MinMax(-1, 1),
  "truncate": ZScoreTrunc(devs=2),
  "entity": "user",
}`,
        },
      ],
      [resourceTypes.TRAINING_SET]: [
        {
          name: "FraudDetection",
          description:
            "A Training Set used to train our fraud detection model.",
          tags: [],
          versions: ["2", "1"],
          language: "json",
          config: `{
  "label_stream": "charges",
  "label_field": "is_fraud",
  "label_timestamp_field": "ts",
  "features": ["LogAvgPurchasePrice"],
  "entities": {"user": extractFieldFromLabel("user")},
}`,
        },
      ],
      [resourceTypes.FEATURE_SET]: [],
    };
    return Promise.resolve({
      data: data[type],
    });
  }
}
