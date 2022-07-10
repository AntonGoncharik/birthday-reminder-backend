export const getNotificationList = `
  SELECT 
    birthday_people.first_name,
    birthday_people.last_name,
    birthday_people.birth_date,
    DATE_PART('year', AGE(CURRENT_DATE, birthday_people.birth_date)) + 1 AS years,
    users.email
  FROM birthday_people 
    INNER JOIN users ON birthday_people.user_id = users.id
  WHERE EXTRACT(MONTH FROM birth_date) = $1
    AND EXTRACT(DAY FROM birth_date) = $2;
`;
