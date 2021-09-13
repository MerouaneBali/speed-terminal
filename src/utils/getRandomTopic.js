export default () => {
  const topics = ['Randomization', 'Abdelkader ibn Muhieddine'];

  const index = Math.floor(Math.random() * topics.length);

  return topics[index];
};
