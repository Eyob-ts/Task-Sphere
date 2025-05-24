import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const projects: Project[] = [
      { 
        id: 1, 
        name: 'Website Redesign', 
        description: 'Redesign company website', 
        startDate: new Date('2024-03-01T00:00:00.000Z'), 
        endDate: new Date('2024-04-01T00:00:00.000Z') 
      },
      { 
        id: 2, 
        name: 'Mobile App Development', 
        description: 'Develop new mobile app', 
        startDate: new Date('2024-03-15T00:00:00.000Z'), 
        endDate: new Date('2024-05-15T00:00:00.000Z') 
      }
    ];

    const tasks: Task[] = [
      { 
        id: 1, 
        title: 'Design Homepage', 
        description: 'Create new homepage design with modern UI/UX', 
        status: 'To Do',
        dueDate: new Date('2024-06-15T00:00:00.000Z'),
        projectId: 1 
      },
      { 
        id: 2, 
        title: 'Implement Navigation', 
        description: 'Build responsive navigation with mobile support', 
        status: 'In Progress',
        dueDate: new Date('2024-06-20T00:00:00.000Z'),
        projectId: 1 
      },
      { 
        id: 3, 
        title: 'Setup Development Environment', 
        description: 'Configure all development tools and dependencies', 
        status: 'Done',
        dueDate: new Date('2024-06-10T00:00:00.000Z'),
        projectId: 2 
      }
    ];

    return { 
      projects: [...projects],
      tasks: [...tasks]
    };
  }

  // Override the genId method to ensure that projects and tasks always have an id.
  // If the array is empty, the method returns the initial number (11).
  // If the array is not empty, the method returns the highest id + 1.
  genId<T extends Project | Task>(collection: T[], collectionName?: string): number {
    if (collection.length === 0) {
      return 1;
    }
    return Math.max(...collection.map(item => item.id)) + 1;
  }
}
