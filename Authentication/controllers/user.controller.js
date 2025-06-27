const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  res.cookie("token", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(
      new AppError("Email already in use, please try to login.", 400),
    );
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please enter a email and password.", 400));
  const user = await User.findOne({ email })
    .select("+password")
    .select("+active");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid email or password.", 401));
  if (!user.active) {
    user.active = true;
    await user.save({ validateBeforeSave: false });
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token.length === 0)
    return next(new AppError("you are not authorized.", 401));
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findOne({ _id: decode.id, active: true });
  if (!currentUser)
    return next(new AppError("This user is no longer exsit.", 401));
  if (currentUser.isPasswordChaned(decode.iat))
    return next(new AppError("This password is no longer valid.", 401));
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("Permisson denided", 403));
    next();
  });
};
