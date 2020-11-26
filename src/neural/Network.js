const NodeFactory = require("./node/NodeFactory");

class Network {
  constructor(blueprint) {
    /// JSON string? Parse it
    blueprint =
      typeof blueprint === "string" ? JSON.parse(blueprint) : blueprint;

    /// Misc
    this._nextNodeId = blueprint.nextNodeId;

    /// Load nodes
    this._nodes = new Map();

    blueprint.nodes.forEach((nodeBlueprint, nodeId) => {
      this._nodes.set(nodeId, NodeFactory(nodeId, nodeBlueprint));
    });

    // Initialise nodes (map output references etc)
    this._nodes.forEach(node => node.init(this));

    /// Load inputs and outputs
    this._inputs = blueprint.inputs.map(nodeId => this._nodes.get(nodeId));
    this._outputs = blueprint.outputs.map(nodeId => this._nodes.get(nodeId));
  }

  getNode(nodeId) {
    return this._nodes.get(nodeId);
  }

  run(inputs) {
    /// Reset values for all nodes
    this._nodes.forEach((node, nodeIndex) => {
      node.resetData();
    });

    /// Pass input values to input nodes
    // They will propagate them to their outputs etc
    inputs.forEach((inputValue, inputNodeIndex) => {
      this._inputs[inputNodeIndex].setValue(inputValue);
    });

    /// Return output nodes' values
    return this._outputs.map(node => node.getValue());
  }

  toObject() {
    const nodeObjects = [];

    this._nodes.forEach(node => {
      nodeObjects[node.id] = node.toObject();
    });

    return {
      inputs: this._inputs.map(node => node.id),
      outputs: this._outputs.map(node => node.id),
      nodes: nodeObjects,
      nextNodeId: this._nextNodeId
    };
  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  clone() {
    return new Network(this.toObject());
  }
}

module.exports = Network;
