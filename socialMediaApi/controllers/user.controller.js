import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
import { getOne } from "./handelerFactory.js";

const filter = (obj, ...allowedField) => {
  const filtered = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) {
      filtered[el] = obj[el];
    }
  });
  return filtered;
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("Unable to update your password.", 400));
  const filteredBody = filter(req.body, "name");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const getMe = getOne(User);

export { updateMe, getMe };
