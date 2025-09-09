import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'http://localhost:3000/projects';
  private tasksUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) { }

  createProject(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data)
  }

  getProject(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.tasksUrl}`, task);
  }

  updateTaskColumn(taskId: string, newColumn: string) {
    return this.http.patch(`${this.tasksUrl}/${taskId}`, { column: newColumn });
  }

  getTasksByProject(projectId: string) {
    return this.http.get<Task[]>(`${this.tasksUrl}?projectId=${projectId}`);
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${this.tasksUrl}/${taskId}`);
  }

  getProjects() {
  return this.http.get<any[]>(`${this.baseUrl}`);
}

}
