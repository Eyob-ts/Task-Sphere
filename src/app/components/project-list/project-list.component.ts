import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  displayedColumns: string[] = ['name', 'description', 'startDate', 'endDate', 'actions'];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        console.log('Projects loaded:', projects);
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  openProjectDialog(project?: Project): void {
    console.log('Opening project dialog with data:', project);
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: '500px',
      data: project || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        const operation = result.id
          ? this.projectService.updateProject(result)
          : this.projectService.createProject(result);

        operation.subscribe({
          next: () => {
            console.log('Project operation successful');
            this.loadProjects();
          },
          error: (error) => {
            console.error('Error performing project operation:', error);
          }
        });
      }
    });
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }
}
