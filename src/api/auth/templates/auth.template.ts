export const getTemplateRegistartionEmail = (activationLink: string) => {
  return `
    <div>
      <h1 style="color: black">Congratulations! You've registered on the BIRTHDAY REMINDER.</h1>
      <h2 style="color: black">To complete registration follow the link: 
        <a href=${process.env.API_URL}/auth/active/${activationLink}>
          ${process.env.API_URL}/auth/active/${activationLink}
        </a>
      </h2>
    </div>
  `;
};
