const validator = require("validator");
const validateSchemaData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Not a valid emailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Not a valid password");
  }
};

module.exports = { validateSchemaData };
