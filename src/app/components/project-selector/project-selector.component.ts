import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
  @Input() selectedProjectId: number | null = null;
  @Output() projectSelected = new EventEmitter<number | null>();
  @Output() projectAdded = new EventEmitter<Project>();

  projects: Project[] = [];
  loading = false;
  error: string | null = null;
  projectTaskCounts: { [key: number]: number } = {};

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loadProjectTaskCounts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error = 'Failed to load projects. Please try again.';
        this.loading = false;
      }
    });
  }

  loadProjectTaskCounts(): void {
    this.projects.forEach(project => {
      this.taskService.getTasksByProject(project.id).subscribe(tasks => {
        this.projectTaskCounts[project.id] = tasks.length;
      });
    });
  }

  getProjectTaskCount(projectId: number): number {
    return this.projectTaskCounts[projectId] || 0;
  }

  getSelectedProjectName(): string {
    if (this.selectedProjectId === null) {
      return 'All Projects';
    }
    const selectedProject = this.projects.find(p => p.id === this.selectedProjectId);
    return selectedProject ? selectedProject.name : 'Select Project';
  }

  onProjectChange(event: any): void {
    const projectId = event.value !== null ? Number(event.value) : null;
    this.projectSelected.emit(projectId);
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects(); // Reload projects to include the new one
        this.projectAdded.emit(result);
      }
    });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects(); // Reload projects to reflect changes
      }
    });
  }

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.loadProjects(); // Reload projects after deletion
          // If the deleted project was selected, clear the selection
          if (this.selectedProjectId === projectId) {
            this.selectedProjectId = null;
            this.projectSelected.emit(null);
          }
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.error = 'Failed to delete project. Please try again.';
        }
      });
    }
  }
}
