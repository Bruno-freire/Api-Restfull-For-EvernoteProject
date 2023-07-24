const validateAndTransformEmail = (req, res, next) => {
  const { email } = req.body
  if(!email){
    console.log('Não existe a propriedade email!')
    next();
  }else{
    req.body.email = email.toLowerCase().trim();
    next();
  }
}

module.exports = {validateAndTransformEmail}