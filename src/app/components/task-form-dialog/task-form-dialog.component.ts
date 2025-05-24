import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent {
  form: FormGroup;
  dialogTitle: string;

  statusOptions = ['To Do', 'In Progress', 'Done'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.dialogTitle = data.id ? 'Edit Task' : 'New Task';
    this.form = this.fb.group({
      id: [data.id],
      title: [data.title, Validators.required],
      description: [data.description, Validators.required],
      dueDate: [data.dueDate, Validators.required],
      status: [data.status || 'To Do', Validators.required],
      projectId: [data.projectId, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
