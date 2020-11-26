const { train } = require("../ml/train");

console.log("Training...");

let best = train({
  mutate(a) {
    a.value += (Math.random() - 0.5) / 100;
    return a;
  },

  crossover(a, b) {
    let sum = a.value + b.value;
    let move = Math.random() * sum;

    a.value = sum * move;
    b.value = sum * (1 - move);

    return [a, b];
  },

  fitness({ value }) {
    return -Math.abs(125 - value);
  },

  population: [{ value: 100 }],

  ready(cycle, score, data) {
    return score < 0.00000001 && score > -0.00000001;
  }
});

console.log("Finished with:", best);
