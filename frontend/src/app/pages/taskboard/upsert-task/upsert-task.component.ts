import { Component, Inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Task } from '../../../models/task';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upsert-task',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './upsert-task.component.html',
  styleUrl: './upsert-task.component.scss',
})
export class UpsertTaskComponent {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpsertTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: [
        {
          value: task?.title,
          disabled: task?.status && task?.status !== 'to-do',
        },
        [Validators.required],
      ],
      description: [task?.description, Validators.required],
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onValidateClick(form: any): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(
        this.task
          ? {
              _id: this.task._id,
              status: this.task.status,
              ...this.taskForm.value,
            }
          : this.taskForm.value
      );
    }
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }
}
