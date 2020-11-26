const Network = require("./neural/Network");

const feedForwardBlueprintXOR = {
  inputs: [0, 1],
  outputs: [5],
  nodes: [
    // Layer 1 // (input)
    /* 0 */ { type: "perceptron", outputs: [2, 3], outputWeights: [1, 1] },
    /* 1 */ { type: "perceptron", outputs: [3, 4], outputWeights: [1, 1] },

    // Layer 2 // (hidden)
    /* 2 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [5],
      outputWeights: [1]
    },
    /* 3 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [5],
      outputWeights: [-2]
    },
    /* 4 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [5],
      outputWeights: [1]
    },

    // Layer 3 // (hidden)
    /* 5 */ { type: "perceptron", activation: "relu" }
  ],
  nextNodeId: 6
};

const net = new Network(feedForwardBlueprintXOR);

console.log(net.clone());
