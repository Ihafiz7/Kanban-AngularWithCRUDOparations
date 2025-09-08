import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  projects:any[] = [];
  

  constructor( private http: ProjectService, private route : ActivatedRoute){}

  ngOnInit(): void {
    this.loadProjects();
  }
  loadProjects() {
    const projectId:string = this.route.snapshot.paramMap.get('id')!;
    this.http.getProjectById(projectId).subscribe({
      next: (data) => {
        this.projects = data;  
        console.log('current project: ', data);
      },
      error: (err) => console.log('Error Loading Projects: ',err),
      
    });
  }

  








  projectName = 'Alpha';
  tabs = ['Kanban', 'Summary', 'Forms', 'Users'];
  selectedTabIndex = 0;

  columnKeys = ['todo', 'inProgress', 'inReview', 'done'];
  columnNames: any = {
    todo: 'To Do',
    inProgress: 'In Progress',
    inReview: 'In Review',
    done: 'Done'
  };

  tasks: any = {
    todo: [
      { title: 'Setup Project', description: 'Initialize Angular + Spring Boot', notes: [] },
      { title: 'Database Schema', description: 'Design core tables', notes: [] }
    ],
    inProgress: [
      { title: 'Auth Module', description: 'Implement JWT login', notes: [] }
    ],
    inReview: [
      { title: 'UI Review', description: 'Review landing page design', notes: [] }
    ],
    done: [
      { title: 'Landing Page', description: 'Basic home page layout complete', notes: [] }
    ]
  };

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  addTask(column: string) {
    const title = prompt('Enter task title:');
    if (title) {
      const description = prompt('Enter task description:') || '';
      this.tasks[column].push({ title, description, notes: [] });
    }
  }

  removeTask(column: string, index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks[column].splice(index, 1);
    }
  }

  changeStatus(column: string, index: number) {
    const statuses = this.columnKeys.filter(c => c !== column);
    const newStatus = prompt(`Move task to which status? Options: ${statuses.join(', ')}`);
    if (newStatus && this.tasks[newStatus]) {
      this.tasks[newStatus].push(this.tasks[column][index]);
      this.tasks[column].splice(index, 1);
    }
  }

  addNote(column: string, index: number) {
    const note = prompt('Enter note for this task:');
    if (note) {
      this.tasks[column][index].notes.push(note);
    }
  }
}
