export const userByEmail = `
  SELECT 
  id,
  password,
  first_name AS firstName,
  last_name AS lastName , 
  email, avatar_path AS avatarPath
  FROM users
  WHERE email = $1
  LIMIT 1;
`;
