export const generateRandomValue = (min: number, max: number, numAfterDigit = 0): number =>
  Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));

export const getRandomArrayItem = <T>(arr: T[]): T => {
  const randomIndex = generateRandomValue(0, arr.length - 1);
  return arr[randomIndex];
};

export const getRandomArrayItems = <T>(items: T[]): T[] => {
  const itemsCopy = [...items];
  const length = generateRandomValue(1, itemsCopy.length);

  return Array.from({ length }, () => {
    const index = generateRandomValue(0, itemsCopy.length - 1);
    return itemsCopy.splice(index, 1)[0];
  });
}
