export const getByEmail = `
  SELECT 
  id,
  first_name AS "firstName",
  last_name AS "lastName", 
  email,
  password,
  activation_link AS "activationLink",
  activated,
  created_at AS "createdAt"
  FROM users
  WHERE email = $1
  LIMIT 1;
`;

export const create = `
  INSERT INTO users
  (email, password, activation_link)
  VALUES ($1, $2, $3)
  RETURNING
  id,
  first_name AS "firstName",
  last_name AS "lastName",
  email,
  activation_link AS "activationLink",
  activated,
  created_at AS "createdAt";
`;
