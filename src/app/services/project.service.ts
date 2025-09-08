import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'http://localhost:3000/projects';

  constructor(private http : HttpClient) { }

  createProject(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}`, data)
  }

  getProject():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

}
