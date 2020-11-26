const geneticAlgorithmConstructor = require("geneticalgorithm");

/**
 * mutate: f(data) -> data
 * crossover: f(dataA, dataB) -> [dataA, dataB]
 * fitness: f(data) -> number
 * population: [data, ...]
 * ready: f(cycleNumber, bestScore, bestData) -> boolean
 */
function train({ mutate, crossover, fitness, population, ready }) {
  const ga = geneticAlgorithmConstructor({
    mutationFunction: mutate,
    crossoverFunction: crossover,
    fitnessFunction: fitness,
    population: population
  });

  let cycle = 0;
  let best = null;
  let score = null;

  do {
    let result = ga.evolve();
    best = ga.best();
    score = result.bestScore();
    cycle++;
  } while (!ready(cycle, score, best));

  return {
    result: best,
    score: score,
    cycles: cycle
  };
}

module.exports = { train };
