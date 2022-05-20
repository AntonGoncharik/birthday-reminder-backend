export const getAll = `
  SELECT 
  id,
  user_id AS "userId",
  first_name AS "firstName",
  last_name AS "lastName", 
  birth_date AS "birthDate",
  created_at AS "createdAt"
  FROM birthday_people;
`;

export const getById = `
  SELECT 
  id,
  user_id AS "userId",
  first_name AS "firstName",
  last_name AS "lastName", 
  birth_date AS "birthDate",
  created_at AS "createdAt"
  FROM birthday_people
  WHERE id = $1
  LIMIT 1;
`;

export const create = `
  INSERT INTO birthday_people
  (user_id, first_name, last_name, birth_date)
  VALUES ($1, $2, $3, $4)
  RETURNING
  id,
  user_id AS "userId",
  first_name AS "firstName",
  last_name AS "lastName", 
  birth_date AS "birthDate",
  created_at AS "createdAt";
`;

export const getUpdate = (sqlUpdate: string) => `
  UPDATE birthday_people
  ${sqlUpdate}
  RETURNING
  id,
  user_id AS "userId",
  first_name AS "firstName",
  last_name AS "lastName", 
  birth_date AS "birthDate",
  created_at AS "createdAt";
`;
