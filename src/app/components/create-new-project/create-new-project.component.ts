import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent {
  projectForm!: FormGroup;
  customColumns: string[] = [];

  columnOptions = [
    { label: 'ToDo', value: 'todo' },
    { label: 'InProgress', value: 'inProgress' },
    { label: 'InReview', value: 'inReview' },
    { label: 'Done', value: 'done' }
  ];

  constructor(private fb: FormBuilder, private api: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectType: ['', Validators.required],
      columns: [[], Validators.required],
      newCustomColumn: ['']
    });
  }

  //Checkbox changes
  onColumnChange(event: any): void {
    const columns = this.projectForm.get('columns')?.value || [];
    if (event.target.checked) {
      columns.push(event.target.value);
    } else {
      const index = columns.indexOf(event.target.value);
      if (index >= 0) {
        columns.splice(index, 1);
      }
    }
    this.projectForm.get('columns')?.setValue(columns);
    this.projectForm.get('columns')?.updateValueAndValidity();
  }

  // Add a custom column
  addCustomColumn(): void {
    const newCol = this.projectForm.get('newCustomColumn')?.value?.trim();
    if (newCol && !this.customColumns.includes(newCol)) {
      this.customColumns.push(newCol);
      this.projectForm.get('newCustomColumn')?.reset();
    }
  }

  // Remove custom column
  removeCustomColumn(index: number): void {
    this.customColumns.splice(index, 1);
  }

  // Submit form
  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = {
        ...this.projectForm.value,
        customColumns: this.customColumns
      };

      console.log('Form submitted:', formValue);

      //send to backend 
      this.api.createProject(formValue).subscribe({
        next: (res) => {
          const newProjectId = res.id;
          console.log('Newly created project ID:', newProjectId);
          this.router.navigate([`/kanban/${newProjectId}`], newProjectId)
        },
        error: (err) => console.error('Error saving project:', err),
        
      });

      
    }
  }
}
