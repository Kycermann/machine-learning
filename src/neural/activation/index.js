const activationFunctions = {
  relu: x => (x < 0 ? 0 : x),
  sigmoid: x => 1 / (1 + Math.exp(-x)),
  swish: x => x / (1 + Math.exp(-x)),
  passthrough: x => x
};

module.exports = activationFunctions;
