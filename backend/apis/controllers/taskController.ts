import { Request, Response } from "express";
import Task from "../models/taskModel";
import mongoose from "mongoose";

export const createTask = async (req: Request, res: Response) => {
  try {
    // Only the title and description are required when creating
    const { title, description } = req.body;
    // We put the default status at to-do when a task is created
    const task = new Task({ title, description, status: "to-do" });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    // If an error occurs, we check if it's due to the validation
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation error", messages: validationErrors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
