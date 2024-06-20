import { Request, Response } from "express";
import Task from "../models/taskModel";
import mongoose, { isValidObjectId } from "mongoose";

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

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    // We validate the mongoDb id
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = await Task.findById(req.params.id);
    // We check if the task exists
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;

  try {
    // We validate the mongoDb id
    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    // We check if the task exists
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // We check if the title is modified when the status isn't to-do
    if (
      task.title !== title &&
      (task.status !== "to-do" || status !== "to-do")
    ) {
      return res
        .status(400)
        .json({ error: "Cannot modify title when status changed" });
    }

    // We check status transition rules
    if (status && !isValidStatusTransition(task.status, status)) {
      return res.status(400).json({ error: "Invalid status transition" });
    }

    // We Save the updated task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
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

// Helper function to validate status transitions
const isValidStatusTransition = (
  currentStatus: string,
  newStatus: string
): boolean => {
  const validTransitions: { [key: string]: string[] } = {
    "to-do": ["to-do", "in-progress"],
    "in-progress": ["in-progress", "done"],
  };
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    // We check if the task exists
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
