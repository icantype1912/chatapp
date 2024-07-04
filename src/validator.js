const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const validateEmail = (x) => {
  return x.match(emailRegex);
};

const validatePassword = (x) => {
  return x.match(passwordRegex);
};

export { validateEmail, validatePassword };
