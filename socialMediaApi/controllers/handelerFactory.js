import APIFeatures from "../utils/APIFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id);
    if (!document) return next(new AppError("No document found", 404));
    res.status(204).json({
      status: "success",
      message: `${model} successfully deleted`,
    });
  });

const updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const udatedDocument = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!udatedDocument) return next(new AppError("No document found", 404));
    res.status(200).json({
      status: "success",
      data: udatedDocument,
    });
  });

const createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await model.create({
      ...req.body,
      createdBy: req.user.id,
      // tour: req.params.tourId || req.body.tour,
    });
    newDocument.password = undefined;
    res.status(201).json({
      status: "success",
      data: newDocument,
    });
  });

const getOne = (model, populate) =>
  catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      model.findById(req.params.id || req.user.id),
      req.query,
    )
      .filter()
      .fieldSelect();
    if (populate) features.query = features.query.populate(populate);
    const document = await features.query;
    if (document.length === 0)
      return next(new AppError("No document found", 404));
    res.status(200).json({
      status: "success",
      data: document[0],
    });
  });

const getAll = (model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(model.find(), req.query)
      .filter()
      .fieldSelect()
      .sort()
      .pagination();
    const document = await features.query;
    res.status(200).json({
      status: "success",
      resutls: document.length,
      data: document,
    });
  });

export { updateOne, createOne, getOne, getAll, deleteOne };
