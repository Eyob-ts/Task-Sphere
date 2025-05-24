import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  projects: Project[] = [];
  loading = false;

  statusOptions = ['To Do', 'In Progress', 'Done'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.dialogTitle = data && data.id ? 'Edit Task' : 'New Task';
    this.form = this.fb.group({
      id: [data && data.id ? data.id : null],
      title: [data && data.title ? data.title : '', Validators.required],
      description: [data && data.description ? data.description : '', Validators.required],
      dueDate: [data && data.dueDate ? new Date(data.dueDate) : null, Validators.required],
      status: [data && data.status ? data.status : 'To Do', Validators.required],
      projectId: [data && data.projectId ? data.projectId : null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      // Ensure dates are properly formatted
      if (formValue.dueDate) {
        formValue.dueDate = new Date(formValue.dueDate);
      }
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
