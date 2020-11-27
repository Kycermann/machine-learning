const Node = require("./Node");
const activationFunctions = require("../activation");

class Perceptron extends Node {
  constructor(blueprint) {
    super(blueprint);

    this._activation = blueprint.activation || null;
    this._activationFunction = activationFunctions[this._activation] || null;
    this._outputs = [...(blueprint.outputs || [])];
    this._outputWeights = [...(blueprint.outputWeights || [])];

    this._value = 0;
    this._usedInputCount = 0;
    this._activated = false;
  }

  init(network) {
    this._outputs.forEach((nodeId, index) => {
      const output = network.getNode(nodeId);
      this._outputs[index] = output;
      output.linkInput(this);
    });
  }

  resetData() {
    this._value = 0;
    this._usedInputCount = 0;
    this._activated = false;
  }

  setValue(value) {
    this._value = value;
    this._activate();
  }

  inputData(value) {
    this._value += value;
    this._usedInputCount++;

    // If all inputs are given, activate
    if (this.getInputCount() === this._usedInputCount) {
      this._activate();
    }
  }

  _activate() {
    if (this._activated) {
      throw new Error(`Node ${this.id} not activated!`);
    }

    if (this._activation !== null) {
      this._value = this._activationFunction(this._value);
    }

    this._outputs.forEach((outputNode, outputIndex) => {
      outputNode.inputData(this._outputWeights[outputIndex] * this._value);
    });

    this._activated = true;
  }

  getValue() {
    if (!this._activated) {
      this._activate();
    }

    return this._value;
  }

  toObject() {
    const object = {
      id: this.id,
      type: "perceptron"
    };

    if (this._activation !== null) {
      object.activation = this._activation;
    }

    if (this._outputs.length !== 0) {
      object.outputs = this._outputs.map(node => node.id);
      object.outputWeights = [...this._outputWeights];
    }

    return object;
  }

  getOutputs() {
    const outputs = new Set(this._outputs);

    this._outputs.forEach(output =>
      output.getOutputs().forEach(output => outputs.add(output))
    );

    return outputs;
  }
}

module.exports = Perceptron;
