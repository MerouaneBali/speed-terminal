/**
 * @module getRandomTopic
 * @description Selects a random topic from a pre-chosen topics array
 * @example const randomTopic = getRandomTopic(); // Abdelkader ibn Muhieddine
 * @returns {string} Random topic
 */
export default () => {
  const topics = ['Randomization', 'Iron Man'];

  const index = Math.floor(Math.random() * topics.length);

  return topics[index];
};
