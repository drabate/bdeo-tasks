import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
// We use the .env file to connect to mongoDB
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";

app.use(bodyParser.json());

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.use("/tasks", taskRoutes);

    // We handle undefined routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ error: "Route not found" });
    });

    // We handle the generic errors
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: err.message });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });