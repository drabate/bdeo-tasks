import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  taskBaseUrl = 'http://localhost:3000/tasks';

  constructor(private httpClient: HttpClient) {}

  getAllTasks(): Promise<Task[]> {
    return firstValueFrom(this.httpClient.get<Task[]>(this.taskBaseUrl));
  }

  updateTask(task: Task) {
    return firstValueFrom(
      this.httpClient.put(`${this.taskBaseUrl}/${task._id}`, task)
    );
  }

  deleteTask(task: Task) {
    return firstValueFrom(
      this.httpClient.delete(`${this.taskBaseUrl}/${task._id}`)
    );
  }
}
