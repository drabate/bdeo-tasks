import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../models/task';
import { NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskComponent } from './task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { UpsertTaskComponent } from './upsert-task/upsert-task.component';

@Component({
  selector: 'app-taskboard',
  standalone: true,
  imports: [NgFor, TaskComponent],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css',
})
export class TaskboardComponent implements OnInit {
  tasks: Task[] = [];
  toDoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(
    private taskService: TasksService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.tasks = await this.taskService.getAllTasks();
    this.organiseTasks();
  }

  organiseTasks() {
    this.toDoTasks = this.tasks.filter((task) => task.status === 'to-do');
    this.inProgressTasks = this.tasks.filter(
      (task) => task.status === 'in-progress'
    );
    this.doneTasks = this.tasks.filter((task) => task.status === 'done');
  }

  async changeStatus(task: Task) {
    try {
      switch (task.status) {
        case 'to-do':
          task.status = 'in-progress';
          break;
        case 'in-progress':
          task.status = 'done';
          break;
        default:
      }
      await this.taskService.updateTask(task);
      this.organiseTasks();
    } catch (error) {
      this.handleError(error);
    }
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(UpsertTaskComponent, {
      data: Object.assign({}, task),
    });

    dialogRef.afterClosed().subscribe(async (taskResult) => {
      if (taskResult) {
        try {
          await this.taskService.updateTask(taskResult);
          Object.assign(task, taskResult);
        } catch (error) {
          this.handleError(error);
        }
      }
    });
  }

  async deleteTask(deletedTask: Task) {
    try {
      await this.taskService.deleteTask(deletedTask);
      this.tasks = this.tasks.filter((task) => task._id !== deletedTask._id);
      this.organiseTasks();
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    console.error(error);
    if (error instanceof HttpErrorResponse) {
      this.toastr.error(error.error.error);
    }
  }
}
