export const create = `
  INSERT INTO tokens
  (user_id, access_token, refresh_token)
  VALUES ($1, $2, $3)
  RETURNING *;
`;
