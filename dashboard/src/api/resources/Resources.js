export const resourceTypes = Object.freeze({
  DATA_SOURCE: "Data Source",
  MATERIALIZED_VIEW: "Materialized View",
  FEATURE: "Feature",
  FEATURE_SET: "Feature Set",
  TRAINING_SET: "Training Set",
});

export default class ResourcesAPI {
  fetchResources(type) {
    return Promise.resolve({
      data: [{ name: "abc" }, { name: type }],
    });
  }
}
