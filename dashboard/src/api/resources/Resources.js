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
      data: [
        { name: "abc", description: "This is a representation of the wave height", tags: ["Waves", "Surfing"], versions: ["abc", "1", "2"] },
        { name: type, description: "This embedding captures how advanced a surfer is based on the waves that they surf", versions: ["1"] },
      ],
    });
  }
}
