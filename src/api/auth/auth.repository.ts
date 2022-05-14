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

export const update = `
  UPDATE tokens
  SET access_token = $1, refresh_token = $2
  WHERE user_id = $3
  RETURNING
  id,
  user_id AS "userId",
  access_token AS "accessToken",
  refresh_token AS "refreshToken",
  created_at AS "createdAt";
`;

export const getByRefresh = `
  SELECT
  id,
  user_id AS "userId",
  access_token AS "accessToken,
  refresh_token AS "refreshToken",
  created_at AS "createdAt
  FROM tokens
  WHERE refresh_token = $1
  LIMIT 1;
`;
