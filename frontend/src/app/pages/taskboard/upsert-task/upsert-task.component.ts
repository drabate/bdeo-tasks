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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upsert-task',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './upsert-task.component.html',
  styleUrl: './upsert-task.component.css',
})
export class UpsertTaskComponent {
  constructor(
    public dialogRef: MatDialogRef<UpsertTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
