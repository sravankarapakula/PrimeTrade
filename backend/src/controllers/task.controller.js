import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTask = asyncHandler(async (req, res) => {
  console.log("REQ USER:", req.user);
  console.log("REQ BODY:", req.body);
  const { title } = req.body;
  if (!title) throw new ApiError(400, "Title required");

  const task = await Task.create({
    title,
    description: req.body.description,
    owner: req.user._id
  });

  res.status(201).json(new ApiResponse(201, task));
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });
  res.status(200).json(new ApiResponse(200, tasks));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!task) throw new ApiError(404, "Task not found");

  res.status(200).json(new ApiResponse(200, task));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Deleted"));
});
