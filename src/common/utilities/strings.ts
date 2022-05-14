export const camelToSnake = (str: string) => {
  return str.replace(/[A-Z]/g, (letter: string) => {
    return `_${letter.toLowerCase()}`;
  });
};

export const getSQLUpdate = <T>(id: string, payload: T) => {
  const sqlUpdate = Object.keys(payload)
    .map((item, index) => {
      return `${camelToSnake(item)} = $${index + 1}`;
    })
    .join(', ');

  return `SET ${sqlUpdate}
          WHERE id = $${Object.keys(payload).length + 1}`;
};
