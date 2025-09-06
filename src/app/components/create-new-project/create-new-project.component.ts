import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent {
  projectForm: FormGroup;
  customColumns: string[] = []; // for displaying added custom columns

  columnOptions = [
    { label: 'ToDo', value: 'todo' },
    { label: 'InProgress', value: 'inProgress' },
    { label: 'InReview', value: 'inReview' },
    { label: 'Done', value: 'done' }
  ];

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectType: ['', Validators.required],
      columns: [[], Validators.required],   
      customColumns: [[]],                  
      newCustomColumn: ['']                 
    });
  }

  // Checkbox change handler
  onColumnChange(event: any) {
    const selected = this.projectForm.get('columns')?.value as string[];
    if (event.target.checked) {
      selected.push(event.target.value);
    } else {
      const index = selected.indexOf(event.target.value);
      if (index !== -1) {
        selected.splice(index, 1);
      }
    }
    this.projectForm.get('columns')?.setValue(selected);
  }

  // Add custom column
  addCustomColumn() {
    const newCol = this.projectForm.get('newCustomColumn')?.value?.trim();
    if (newCol) {
      this.customColumns.push(newCol);

      // sync with form control
      this.projectForm.get('customColumns')?.setValue(this.customColumns);

      // clear input
      this.projectForm.get('newCustomColumn')?.reset();
    }
  }

  // Remove custom column
  removeCustomColumn(index: number) {
    this.customColumns.splice(index, 1);

    // sync with form control
    this.projectForm.get('customColumns')?.setValue(this.customColumns);
  }

  // Submit handler
  onSubmit() {
    if (this.projectForm.valid) {
      const payload = this.projectForm.value;

      // Merge default + custom columns for final structure
      const allColumns = [...payload.columns, ...this.customColumns];
      const finalData = { ...payload, allColumns };

      console.log('Form Submitted:', finalData);

      // PUT request :
      // this.http.put('http://localhost:8080/api/projects', finalData)
      //   .subscribe(res => console.log('Saved:', res));
    }
  }
}
