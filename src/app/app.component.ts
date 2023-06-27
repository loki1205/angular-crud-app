import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogRef } from '@angular/cdk/dialog';
import { CoreService } from './core/core.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'dob', 'gender', 'education', 'experience', 'package', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _empService: EmployeeService, private _snackBar: CoreService){}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  openDialog(){
    const dialogRef = this._dialog.open(EmpAddEditComponent)
    dialogRef.afterClosed().subscribe({
      next:(val) => {
        if(val){
          this.getEmployeeList();
        }
      },
    })
  }

  editDialog(data:any){
    const dialogRef = this._dialog.open(EmpAddEditComponent,{
      data,
    })
    dialogRef.afterClosed().subscribe({
      next:(val) => {
        if(val){
          this.getEmployeeList();
        }
      },
    })
  }

  getEmployeeList(){
    this._empService.getEmployee().subscribe({
      next:(res:any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:(err:any) => {
        console.log(err);
      }
    })
  }

  deleteEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._snackBar.openSnackBar('Employee Deleted!','Done');
        this.getEmployeeList();
      },
      error: console.log,
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
