export const getNotificationHTMLTemplate = (options: {
  rememberDay: 'Tomorrow' | 'Today';
  firstName: string;
  lastName: string;
  birthDate: string;
  years: string;
}) => {
  const { rememberDay, birthDate, firstName, lastName, years } = options;

  return `
    <div>
      <h1 style="color: black">${rememberDay} is the birthday of ${firstName} ${lastName}! ${years}! ${birthDate}</h1>
    </div>
  `;
};
