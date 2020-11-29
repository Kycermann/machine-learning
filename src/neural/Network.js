const NodeFactory = require("./node/NodeFactory");

class Network {
  constructor(blueprint) {
    /// JSON string? Parse it
    blueprint =
      typeof blueprint === "string" ? JSON.parse(blueprint) : blueprint;

    /// Misc
    this._nextNodeId = blueprint.nextNodeId;
    this._prune = false;

    /// Load nodes
    this._nodes = new Map();

    blueprint.nodes.forEach(blueprint => {
      this._nodes.set(blueprint.id, NodeFactory(blueprint));
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

  /**
   * Delete non-input non-output nodes that are not useful for this.run
   *
   * The only time to force is when an unpruned blueprint is passed in
   * Blueprints should not need pruning but it can be forced anyway
   */
  prune(force = false) {
    if (!this._prune && !force) return;
    this._prune = false;

    // Get all nodes that inputs reach
    const inputReachedNodes = new Set();

    this._inputs.forEach(inputNode => {
      inputReachedNodes.add(inputNode);
      inputNode.getOutputs().forEach(output => inputReachedNodes.add(output));
    });

    this._outputs.forEach(outputNode => {
      inputReachedNodes.add(outputNode);
    });

    // Figure out which of them reach outputs
    const inputReachedNodesReachOutputs = new Set();

    inputReachedNodes.forEach(node => {
      const checkNodeReachesOutput = node => {
        if (inputReachedNodesReachOutputs.has(node)) return true;

        if (this._outputs.includes(node)) {
          inputReachedNodesReachOutputs.add(node);
          return true;
        }

        for (const output of node.getOutputs()) {
          if (checkNodeReachesOutput(output)) {
            inputReachedNodesReachOutputs.add(node);
            return true;
          }
        }

        return false;
      };

      checkNodeReachesOutput(node);
    });

    const nodesToDelete = new Set();

    // Delete non-input non-output nodes that are unreachable from inputs
    this._nodes.forEach((node, nodeId) => {
      if (!inputReachedNodesReachOutputs.has(node)) nodesToDelete.add(node);
    });

    nodesToDelete.forEach(node => {
      this._nodes.delete(node.id);
      node.destroy();
    });

    // NOTE: This isn't needed if reachable nodes are not deleted
    // if (nodesToDelete.size !== 0) {
    //   // May have more to prune
    //   this._pruneNodes();
    // }
  }

  _updateNodeId(nodeId, newNodeId) {
    if (!this._nodes.has(nodeId))
      throw new Error(`Node ${nodeId} does not exist!`);

    if (this._nodes.has(newNodeId))
      throw new Error(`Node ${newNodeId} already exists!`);

    const node = this._nodes.get(nodeId);

    node.id = newNodeId;
    this._nodes.delete(nodeId);
    this._nodes.set(newNodeId, node);
  }

  toObject(prune = true) {
    if (prune) this.prune();
    const nodeObjects = [];

    this._nodes.forEach(node => {
      nodeObjects.push(node.toObject());
    });

    return {
      inputs: [...this._inputs].map(node => node.id),
      outputs: [...this._outputs].map(node => node.id),
      nodes: nodeObjects,
      nextNodeId: this._nextNodeId
    };
  }

  toString(prune = true) {
    return JSON.stringify(this.toObject(prune));
  }

  clone(prune = false) {
    return new Network(this.toObject(false));
  }
}

module.exports = Network;
