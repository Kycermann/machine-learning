class Node {
  constructor({ id }) {
    this.id = id;
    this.dead = false;

    // Every node accepts inputs
    this._inputNodes = new Set();
  }

  /**
   * Sets internal value, used for input nodes
   */
  setValue() {
    throw new Error("Not implemented!");
  }

  linkInput(inputNode) {
    this._inputNodes.add(inputNode);
  }

  getInputCount() {
    this._inputNodes.forEach(node => {
      if (node.dead) this._inputNodes.delete(node);
    });

    return this._inputNodes.size;
  }

  destroy() {
    this.dead = true;
  }

  resetData() {
    throw new Error("Not implemented!");
  }

  inputData() {
    throw new Error("Not implemented!");
  }

  outputData() {
    throw new Error("Not implemented!");
  }

  getValue() {
    throw new Error("Not implemented!");
  }

  toObject() {
    throw new Error("Not implemented!");
  }

  toString() {
    return JSON.stringify(this.toObject);
  }
}

module.exports = Node;
