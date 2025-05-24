import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form-dialog',
  templateUrl: './project-form-dialog.component.html',
  styleUrls: ['./project-form-dialog.component.scss']
})
export class ProjectFormDialogComponent implements OnInit {
  form: FormGroup;
  dialogTitle: string;
  loading = false;
  error: string | null = null;
  minEndDate: Date;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectFormDialogComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.dialogTitle = data && data.id ? 'Edit Project' : 'New Project';
    this.minEndDate = new Date();
    
    this.form = this.fb.group({
      id: [data && data.id ? data.id : null],
      name: [data && data.name ? data.name : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: [data && data.description ? data.description : '', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      startDate: [data && data.startDate ? new Date(data.startDate) : new Date(), Validators.required],
      endDate: [data && data.endDate ? new Date(data.endDate) : null, Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    // Update min end date when start date changes
    const startDateControl = this.form.get('startDate');
    if (startDateControl) {
      startDateControl.valueChanges.subscribe(startDate => {
        if (startDate) {
          this.minEndDate = new Date(startDate);
          this.minEndDate.setDate(this.minEndDate.getDate() + 1);
        }
      });
    }
  }

  dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDateControl = group.get('startDate');
    const endDateControl = group.get('endDate');
    const startDate = startDateControl ? startDateControl.value : null;
    const endDate = endDateControl ? endDateControl.value : null;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return { 'dateRange': true };
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;
      
      const formValue = this.form.value;
      const projectData: Project = {
        id: formValue.id,
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate)
      };

      const request = projectData.id 
        ? this.projectService.updateProject(projectData)
        : this.projectService.createProject(projectData);

      request.subscribe({
        next: (savedProject) => {
          this.snackBar.open(
            `Project "${savedProject.name}" ${projectData.id ? 'updated' : 'created'} successfully!`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(savedProject);
        },
        error: (error) => {
          console.error('Error saving project:', error);
          this.error = error.message || 'Failed to save project. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
