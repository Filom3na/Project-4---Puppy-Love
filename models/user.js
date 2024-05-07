import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ? Fields defined on model
// 1. First Name
// 2. Last Name
// 3. Email
// 4. Password
// 5. Location
// 6. Age Required

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  age: { type: Number, required: true, min: 18 }
})


// ? Fields not defined on model
// 1. Password confirmation
userSchema
  .virtual('passwordConfirmation')
  .set(function (value) {
    this._passwordConfirmation = value
  })

// ? Custom Validation
// Checking the password and passwordConfirmation match. 
userSchema.pre('validate', function (next) {
  if (
    this.isModified('password') &&
    this.password !== this._passwordConfirmation
  ) {
    this.invalidate('passwordConfirmation', 'Make sure your passwords match!')
  }
  next()
})

// hash the password
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password. bcrypt.genSaltSync(12))
  }
  next()
})

export default mongoose.model('User', userSchema)