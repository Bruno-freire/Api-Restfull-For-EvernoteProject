function validateAndTransformEmail(email) {
  return email.toLowerCase().trim();
}

module.exports = {validateAndTransformEmail}