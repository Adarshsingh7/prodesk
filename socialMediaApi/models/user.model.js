import validator from "validator";
import bcrypt from "bcrypt";

import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User must have a name."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a email."],
    unique: [
      true,
      "User with this email is allready exist please try another Email.",
    ],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [8, "A password must have atleast 8 character."],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter a confirm password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password does not matched.",
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword,
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model("User", userSchema);

export default User;
