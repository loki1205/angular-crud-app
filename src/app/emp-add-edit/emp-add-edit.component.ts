import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {

  empForm: FormGroup;
  options : string[]  = [
    'SSLC',
    'Diploma',
    'HSC',
    'Graduate',
    'Post Graduate'
  ]

  ngOnInit(): void {
    this.empForm.patchValue(this.data)
  }

  genders: string[] = [
    'Male',
    'Female',
    'Transgender',
    'Prefer not to say'
  ]

  constructor(private _fb: FormBuilder, private _empService: EmployeeService, private _dialogRef:MatDialogRef<EmpAddEditComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private _snackBar: CoreService){
    this.empForm = this._fb.group({
      firstName:'',
      lastName:'',
      email:'',
      dob:'',
      education:'',
      gender:'',
      experience:'',
      package:''
    })
  }

  onFormSubmit(){
    if (this.empForm.valid){
      if(this.data)
      {
        this._empService.editEmployee(this.data.id,this.empForm.value).subscribe({
          next:(value:any) => {
            this._snackBar.openSnackBar('Employee details updated','Done')
            this._dialogRef.close(true);
          },
          error:(err:any) => {
            console.log(err);
          }
        })
      }
      else
      {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next:(value:any) => {
            this._snackBar.openSnackBar('Employee added','Done')
            this._dialogRef.close(true);
          },
          error:(err:any) => {
            console.log(err);
          }
        })
      }
    }
    else{
      console.log(this.empForm.value)
    }
  }
}
