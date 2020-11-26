const { run } = require("../ml/network");

// Inputs: [ 1 or -1, 1 or -1 ]
// Outputs: 0 or 1

let network = {
  layers: [
    {
      type: "input",
      weights: [
        // weights.length === 2 because this layer has 2 values
        // inner lengths are 3 because next layer has 3 values,
        // so 3 weights per value in this layer going into the next layer
        [1, 1, 0],
        [0, 1, 1]
      ]
    },
    {
      type: "relu",
      weights: [
        // weights.length === 3 because this layer has 3 values
        // inner lengths are 1 because next layer has 1 value
        // so 1 weight per value in this layer going into the next layer
        [1],
        [-2],
        [1]
      ]
    },
    { type: "relu" }
  ]
};

console.log("0 xor 1", run(network, [-1, 1]));
console.log("1 xor 0", run(network, [1, -1]));
console.log("0 xor 0", run(network, [-1, -1]));
console.log("1 xor 1", run(network, [1, 1]));
