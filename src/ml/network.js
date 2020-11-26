const activationFunctions = {
  relu: x => (x < 0 ? 0 : x),
  sigmoid: x => 1 / (1 + Math.exp(-x)),
  swish: x => x / (1 + Math.exp(-x)),
  input: x => x
};

/**
 * layers: [{type: "relu|sigmoid|swish", size: integer}, ...]
 */
function create(layersInfo) {
  const createNullArray = length => Array(length).fill(null);
  const selectRandomWeight = () => (Math.random() - 0.5) * 2;

  const layers = createNullArray(layersInfo.length);

  const createLayer = layerIndex => {
    const { type, size } = layersInfo[layerIndex];
    if (layerIndex === layersInfo.length - 1) return { type };
    const nextLayerSize = layersInfo[layerIndex + 1].size;

    const createNode = () =>
      createNullArray(nextLayerSize).map(selectRandomWeight);

    return { type, weights: createNullArray(size).map(createNode) };
  };

  layers.forEach((_, index) => (layers[index] = createLayer(index)));

  return { layers };
}

function run(network, input) {
  let { layers } = network;
  let currentLayerValues = [...input];

  layers.forEach(({ type, weights = null }, layerIndex) => {
    // Activate values in current layer
    currentLayerValues.forEach(
      (value, index) =>
        (currentLayerValues[index] = activationFunctions[type](value))
    );

    // If no weights, i.e. last layer, skip
    if (weights === null) return;

    // Sum values for new layer
    const nextLayerSize = weights[0].length;
    const nextLayerValues = Array(nextLayerSize).fill(0);

    weights.forEach((weightsToNextLayer, currentLayerValueIndex) => {
      weightsToNextLayer.forEach((weightToNextNode, nextNodeIndex) => {
        nextLayerValues[nextNodeIndex] +=
          weightToNextNode * currentLayerValues[currentLayerValueIndex];
      });
    });

    currentLayerValues = nextLayerValues;
  });

  // Clip temp to results
  return currentLayerValues;
}

module.exports = { create, load: JSON.parse, stringify: JSON.stringify, run };
