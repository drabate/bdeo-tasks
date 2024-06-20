import mongoose, { Document, Schema } from "mongoose";

export interface TaskDoc extends Document {
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
}

// Validation schema
const TaskSchema: Schema<TaskDoc> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "done"],
    required: true,
  },
});

const Task = mongoose.model<TaskDoc>("Task", TaskSchema);

export default Task;
