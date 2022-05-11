export const create = `
  INSERT INTO tokens
  (user_id, access_token, refresh_token)
  VALUES ($1, $2, $3)
  RETURNING
  id,
  user_id AS "userId",
  access_token AS "accessToken",
  refresh_token AS "refreshToken",
  created_at AS "createdAt";
`;
