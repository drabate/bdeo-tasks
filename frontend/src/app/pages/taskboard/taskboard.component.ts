import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../models/task';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-taskboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css',
})
export class TaskboardComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TasksService) {}

  async ngOnInit() {
    this.tasks = await this.taskService.getAllTasks();
  }
}
