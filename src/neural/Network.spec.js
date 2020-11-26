const Network = require("../../src/neural/Network");

describe("Network", () => {
  const blueprint = {
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

  const XOR_10 = [1, -1];
  const XOR_01 = [-1, 1];
  const XOR_00 = [-1, -1];
  const XOR_11 = [1, 1];

  const RESULT_1 = [1];
  const RESULT_0 = [0];

  function testXOR(xorNetwork) {
    expect(xorNetwork.run(XOR_10)).toEqual(RESULT_1);
    expect(xorNetwork.run(XOR_01)).toEqual(RESULT_1);
    expect(xorNetwork.run(XOR_00)).toEqual(RESULT_0);
    expect(xorNetwork.run(XOR_11)).toEqual(RESULT_0);
  }

  it("Performs the XOR function", () => {
    testXOR(new Network(blueprint));
  });

  it("Works when cloned", () => {
    const xorNetwork = new Network(blueprint);
    const clonedXorNetwork = xorNetwork.clone();

    testXOR(clonedXorNetwork);
  });

  it("Does not modify the input blueprint", () => {
    const blueprintA = JSON.parse(JSON.stringify(blueprint));
    const blueprintB = JSON.parse(JSON.stringify(blueprint));

    const network = new Network(blueprintA);

    network.run(XOR_10);

    expect(blueprintA).toEqual(blueprintB);
  });
});
