const Network = require("./neural/Network");

const feedForwardBlueprintXOR = {
  inputs: [0, 1],
  outputs: [9],
  nodes: [
    // Layer 1 // (input)
    /* 0 */ { type: "perceptron", outputs: [5, 6], outputWeights: [1, 1] },
    /* 1 */ { type: "perceptron", outputs: [6, 7], outputWeights: [1, 1] },

    // Useless nodes for pruning tests (3)
    /* 2 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [8, 10],
      outputWeights: [-1, 2]
    },
    /* 3 */ { type: "perceptron", activation: "relu" },
    /* 4 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [8],
      outputWeights: [1]
    },

    // Layer 2 // (hidden)
    /* 5 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [9],
      outputWeights: [1]
    },
    /* 6 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [9],
      outputWeights: [-2]
    },
    /* 7 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [9],
      outputWeights: [1]
    },

    // Useless node for pruning tests (1)
    /* 8 */ {
      type: "perceptron",
      activation: "relu",
      outputs: [10],
      outputWeights: [1]
    },

    // Layer 3 // (output)
    /* 9 */ { type: "perceptron", activation: "relu" },

    // Useless node for pruning tests (1)
    /* 10 */ { type: "perceptron", activation: "relu" }
  ],
  nextNodeId: 11
};

const net = new Network(feedForwardBlueprintXOR);

console.log(net._nodes.size);

net.prune();

console.log(net._nodes, net.toObject().nodes);

console.log("1 xor 0", net.run([1, -1]));
console.log("0 xor 1", net.run([-1, 1]));
console.log("0 xor 0", net.run([-1, -1]));
console.log("1 xor 1", net.run([1, 1]));
