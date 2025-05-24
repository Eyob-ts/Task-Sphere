import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from './models/project.model';
import { ProjectService } from './services/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Task-Sphere';
  projects: Project[] = [];
  selectedProjectId: number | null = null;
  loading = false;

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

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

  onProjectSelected(projectId: number | null): void {
    this.selectedProjectId = projectId;
  }

  onProjectAdded(project: Project): void {
    // The project was already added by the ProjectSelectorComponent
    // We can select it automatically if needed
    this.selectedProjectId = project.id;
    
    // Show a success message
    this.snackBar.open(
      `Project "${project.name}" created successfully!`,
      'Close',
      { duration: 3000 }
    );
  }
}
