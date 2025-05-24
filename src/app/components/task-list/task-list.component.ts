import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() set selectedProjectId(projectId: number | null) {
    this._selectedProjectId = projectId;
    this.loadTasks();
  }
  get selectedProjectId(): number | null {
    return this._selectedProjectId;
  }
  private _selectedProjectId: number | null = null;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  
  loading = false;
  error: string | null = null;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    const tasks$ = this.selectedProjectId 
      ? this.taskService.getTasksByProject(this.selectedProjectId)
      : this.taskService.getTasks();
    
    tasks$.subscribe({
      next: (tasks) => {
        this.groupTasksByStatus(tasks);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  groupTasksByStatus(tasks: Task[]): void {
    this.todoTasks = tasks.filter(task => task.status === 'To Do');
    this.inProgressTasks = tasks.filter(task => task.status === 'In Progress');
    this.doneTasks = tasks.filter(task => task.status === 'Done');
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: { ...task, projectId: this.selectedProjectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.taskService.updateTask(result).subscribe(() => this.loadTasks());
        } else {
          this.taskService.createTask(result).subscribe(() => this.loadTasks());
        }
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between columns
      const task = event.previousContainer.data[event.previousIndex];
      const updatedTask = { ...task };

      // Update task status based on the target column
      if (event.container.id === 'todoList') {
        updatedTask.status = 'To Do';
      } else if (event.container.id === 'inProgressList') {
        updatedTask.status = 'In Progress';
      } else if (event.container.id === 'doneList') {
        updatedTask.status = 'Done';
      }

      // Update the task in the backend
      this.taskService.updateTask(updatedTask).subscribe(() => {
        // Move the task in the UI
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        // Show success message
        this.snackBar.open('Task status updated', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      });
    }
  }

  getTaskStatusClass(task: Task): string {
    switch (task.status) {
      case 'Done':
        return 'status-done';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return 'status-todo';
    }
  }
}
