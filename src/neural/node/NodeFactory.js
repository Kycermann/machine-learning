const Perceptron = require("./Perceptron");

function NodeFactory(blueprint) {
  // Map blueprint.type to correct constructor

  if (blueprint.type === "perceptron") {
    return new Perceptron(blueprint);
  }

  throw new Error(`Unknown node type: ${blueprint.type}`);
}

module.exports = NodeFactory;
