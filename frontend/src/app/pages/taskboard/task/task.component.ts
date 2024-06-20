import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() task: any;
  @Input() bgColor: string = '';
  @Output() edit = new EventEmitter<Task>();
  @Output() next = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  get showNextButton(): boolean {
    return this.task.status !== 'done';
  }

  editTask(task: Task) {
    this.edit.emit(task);
  }

  deleteTask(task: Task) {
    this.delete.emit(task);
  }

  moveNext(task: any) {
    this.next.emit(task);
  }
}
