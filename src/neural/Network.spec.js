const Network = require("../../src/neural/Network");

describe("Network", () => {
  const blueprint = {
    inputs: [0, 1],
    outputs: [9],
    nodes: [
      // Layer 1 // (input)
      /* 0 */ {
        id: 0,
        type: "perceptron",
        outputs: [3, 5, 6],
        outputWeights: [1, 1, 1]
      },
      /* 1 */ {
        id: 1,
        type: "perceptron",
        outputs: [6, 7],
        outputWeights: [1, 1]
      },

      // Useless nodes for pruning tests (3)
      /* 2 */ {
        id: 2,
        type: "perceptron",
        activation: "error",
        outputs: [10],
        outputWeights: [2]
      },
      /* 3 */ { id: 3, type: "perceptron", activation: "relu" },
      /* 4 */ {
        id: 4,
        type: "perceptron",
        activation: "error",
        outputs: [8],
        outputWeights: [1]
      },

      // Layer 2 // (hidden)
      /* 5 */ {
        id: 5,
        type: "perceptron",
        activation: "relu",
        outputs: [9],
        outputWeights: [1]
      },
      /* 6 */ {
        id: 6,
        type: "perceptron",
        activation: "relu",
        outputs: [9],
        outputWeights: [-2]
      },
      /* 7 */ {
        id: 7,
        type: "perceptron",
        activation: "relu",
        outputs: [9],
        outputWeights: [1]
      },

      // Useless node for pruning tests (1)
      /* 8 */ {
        id: 8,
        type: "perceptron",
        activation: "error",
        outputs: [10],
        outputWeights: [1]
      },

      // Layer 3 // (output)
      /* 9 */ { id: 9, type: "perceptron", activation: "relu" },

      // Useless node for pruning tests (1)
      /* 10 */ { id: 10, type: "perceptron", activation: "error" }
    ],
    nextNodeId: 11
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

  it("Deletes nodes are not linked to input when pruned", () => {
    const NODES_LINKED_TO_INPUT = blueprint.nodes.length - 4;
    const NODES_LINKED_TO_INPUT_AND_OUTPUT = blueprint.nodes.length - 5;

    const xorNetwork = new Network(blueprint);

    xorNetwork.prune(true);

    testXOR(xorNetwork);

    // Passes even if 1 node that is linked to input is not pruned
    expect([NODES_LINKED_TO_INPUT, NODES_LINKED_TO_INPUT_AND_OUTPUT]).toContain(
      xorNetwork.toObject().nodes.length
    );
  });

  it("Deletes nodes that are not linked to input or output when pruned", () => {
    const NODES_LINKED_TO_INPUT_AND_OUTPUT = blueprint.nodes.length - 5;
    const xorNetwork = new Network(blueprint);

    xorNetwork.prune(true);

    testXOR(xorNetwork);

    expect(xorNetwork.toObject().nodes.length).toEqual(
      NODES_LINKED_TO_INPUT_AND_OUTPUT
    );
  });
});
