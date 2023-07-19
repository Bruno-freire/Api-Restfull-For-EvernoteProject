const mongoose = require('mongoose')
let bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  createdAt: {type: Date, default: Date.now()},
  updatedAt: {type: Date, default: Date.now()},
  authenticationCode: {type: Number, default: null},
  authenticated: {type: Boolean, default: false},
  authenticationCodeCreatedAt: {type: Date, default: null}
})

userSchema.pre('save', function (next) {
  if(this.isNew || this.isModified('password')){
    bcrypt.hash(this.password, 10, 
      (err, hashedPassword) => {
        if(err) {
          next(err);
        }else{
          this.password = hashedPassword;
          next();
        }
      }  
    )
  } else{
    next();
  }
})

userSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function(err, same) {
    if(err){
      callback(err);
    }else{
      callback(err, same)
    }
  })
}

module.exports = mongoose.model('User', userSchema)