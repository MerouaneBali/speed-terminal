export default () => {
  const topics = ['Randomization', 'Abdelkader ibn Muhieddine'];

  const index = [Math.floor(Math.random() * (topics.length - 1))];

  return topics[index];
};
