import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../apis/index";

let mongoServer: MongoMemoryServer;
let mongoUri: string;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { dbName: "taskdb" });
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.log("Connection error");
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task API", () => {
  it("task creation - should create a new task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
      status: "to-do",
    });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Task");
  });

  it("task creation - without description should send a validation error", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Test Task",
      status: "to-do",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
  });

  it("should get all tasks", async () => {
    const response = await request(app).get("/tasks");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("task update - should update a task status", async () => {
    const taskResponse = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
      status: "to-do",
    });

    const taskId = taskResponse.body._id;

    const response = await request(app).put(`/tasks/${taskId}`).send({
      status: "in-progress",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("in-progress");
  });

  it("task update - should not update a task title if status has changed", async () => {
    const taskResponse = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
    });

    const taskId = taskResponse.body._id;

    const response = await request(app).put(`/tasks/${taskId}`).send({
      title: "New Title",
      status: "in-progress",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Cannot modify title when status changed");
  });

  it("task update - should not update a task status right order", async () => {
    const taskResponse = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
    });

    const taskId = taskResponse.body._id;

    const response = await request(app).put(`/tasks/${taskId}`).send({
      status: "done",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid status transition");
  });

  it("should delete a task", async () => {
    const taskResponse = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
      status: "to-do",
    });

    const taskId = taskResponse.body._id;

    const response = await request(app).delete(`/tasks/${taskId}`);
    expect(response.status).toBe(204);
  });
});
