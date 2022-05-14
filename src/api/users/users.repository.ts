export const getAll = `
  SELECT 
  id,
  first_name AS "firstName",
  last_name AS "lastName", 
  email,
  activated,
  created_at AS "createdAt"
  FROM users;
`;

export const getById = `
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
  WHERE id = $1
  LIMIT 1;
`;

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

export const getByActivationLink = `
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
  WHERE activation_link = $1
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

export const getUpdate = (sqlUpdate: string) => `
  UPDATE users
  ${sqlUpdate}
  RETURNING
  id,
  first_name AS "firstName",
  last_name AS "lastName", 
  email,
  password,
  activation_link AS "activationLink",
  activated,
  created_at AS "createdAt";
`;
