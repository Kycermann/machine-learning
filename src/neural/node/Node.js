class Node {
  constructor({ id }) {
    this.id = id;

    // Every node accepts inputs
    this._inputCount = 0;
  }

  /**
   * Sets internal value, used for input nodes
   */
  setValue() {
    throw new Error("Not implemented!");
  }

  linkInput(inputNode) {
    this._inputCount++;
  }

  getInputCount() {
    return this._inputCount;
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
