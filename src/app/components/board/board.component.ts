import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Task } from 'src/app/task.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  projects: any;
  projectNames: any;
  allColumns: string[] = [];
  tasks: { [key: string]: Task[] } = {};

  // AddModal
  showTaskModal = false;
  selectedColumn: string | null = null;
  taskForm!: FormGroup;

  //statusModal
  statusModalOpen = false;
  statusTask: any;
  statusCurrentColumn: string = '';
  selectedNewColumn: string = '';
  availableColumns: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: ProjectService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: ['']
    });

    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.loadProject(projectId);
      }
    });
  }


  loadProject(projectId: string) {
    this.http.getProjectById(projectId).subscribe({
      next: (data) => {
        this.projects = data;
        // merge columns 
        this.allColumns = [...(data.columns || []), ...(data.customColumns || [])];

        // empty task arrays
        this.allColumns.forEach(col => {
          this.tasks[col] = [];
        });
        this.loadTasks();
      },
      error: (err) => console.error('Error loading project:', err)
    });

    this.http.getProjects().subscribe({
      next: (data) => {
        this.projectNames = data;
        console.log('Loaded project names:', this.projectNames);
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }


  openAddTaskModal(col: string) {
    this.selectedColumn = col;
    this.showTaskModal = true;
    this.taskForm.reset();
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedColumn = null;
  }

  submitTask() {
    if (this.taskForm.valid && this.selectedColumn && this.projects) {
      const newTask: Task = {
        ...this.taskForm.value,
        column: this.selectedColumn,
        projectId: this.projects.id,
        notes: []
      };
      this.tasks[this.selectedColumn].push(newTask);

      this.http.addTask(newTask).subscribe({
        next: (res) => console.log('Task saved to backend:', res),
        error: (err) => console.error('Error saving task:', err)
      });

      this.closeTaskModal();
    }
  }

  removeTask(col: string, taskIndex: number) {
    const task = this.tasks[col][taskIndex];

    if (!task?.id) {
      console.error("Task has no ID, cannot delete from DB");
      return;
    }

    // First remove from backend
    this.http.deleteTask(task.id).subscribe({
      next: () => {
        console.log(`Task ${task.id} deleted from DB`);
        // Then update UI
        this.tasks[col].splice(taskIndex, 1);
      },
      error: (err) => {
        console.error("Error deleting task from DB:", err);
      }
    });
  }

  tabs = ['Kanban', 'Summary', 'Forms', 'Users'];
  selectedTabIndex = 0;

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  addNote(col: string, taskIndex: number) {
    const task = this.tasks[col][taskIndex];

    if (!task.notes) {
      task.notes = [];
    }
    task.notes.push('Added A Note');
  }

  openStatusModal(task: any, currentCol: string) {
    this.statusTask = task;
    this.statusCurrentColumn = currentCol;
    this.availableColumns = this.allColumns.filter(col => col !== currentCol);
    this.selectedNewColumn = this.availableColumns[0] || '';
    this.statusModalOpen = true;
  }

  closeStatusModal() {
    this.statusModalOpen = false;
    this.statusTask = null;
    this.statusCurrentColumn = '';
    this.selectedNewColumn = '';
  }

  changeStatusTo(newColumn: string) {
    if (!this.statusTask || !newColumn) return;

    // Remove task from current column
    const currentCol = this.statusCurrentColumn;
    const taskIndex = this.tasks[currentCol].indexOf(this.statusTask);
    if (taskIndex > -1) {
      this.tasks[currentCol].splice(taskIndex, 1);
    }

    // Add task to new column
    if (!this.tasks[newColumn]) this.tasks[newColumn] = [];
    this.tasks[newColumn].push({ ...this.statusTask, column: newColumn });

    // PATCH to backend
    this.http.updateTaskColumn(this.statusTask.id, newColumn).subscribe({
      next: res => console.log('Task column updated in backend:', res),
      error: err => console.error('Error updating task column:', err)
    });

    this.closeStatusModal();
  }

  loadTasks() {
    if (!this.projects?.id) return;

    this.http.getTasksByProject(this.projects.id).subscribe({
      next: (data: Task[]) => {
        // Clear all columns
        this.allColumns.forEach(col => this.tasks[col] = []);

        // Populate tasks into correct columns
        data.forEach(task => {
          if (!this.tasks[task.column]) this.tasks[task.column] = [];
          this.tasks[task.column].push(task);
        });

        console.log('Tasks loaded:', this.tasks);
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }
}





