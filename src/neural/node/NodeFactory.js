const Perceptron = require("./Perceptron");

function NodeFactory(id, blueprint) {
  // Map blueprint.type to correct constructor

  if (blueprint.type === "perceptron") {
    return new Perceptron(id, blueprint);
  }

  throw new Error(`Unknown node type: ${blueprint.type}`);
}

module.exports = NodeFactory;
