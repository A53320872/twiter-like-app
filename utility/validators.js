/* Two helper functions for validation */
const isEmail = (email) => {
  // Using Regular Expression to check validation
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
}; // check illegal Email

const isEmpty = (string) => {
  // removes whitespace from both sides of a string
  if (string.trim() === "") return true;
  else return false;
}; // check empty input

/* Validation */
exports.validateSignupData = (user) => {
  let errors = {};
  // Checking email errors
  console.log("KKK", user.email, isEmpty(user.email));
  if (isEmpty(user.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(user.email)) {
    errors.email = "Must be a valid email address";
  }
  // Checking password errors and handle errors
  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (user.password !== user.confirmPassword)
    errors.confirmPassword = "Password must match";
  if (isEmpty(user.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (user) => {
  let errors = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // if not statrt with 'http'?, add 'http://'
    console.log("checkHTTP\n", data.website.trim().substring(0, 4));
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
