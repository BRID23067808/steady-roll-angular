import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ContactService } from '../../../services/contact/contact.service';
import { Contact } from '../../../services/contact/contact';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-contacts-list',
  templateUrl: './admin-contacts-list.component.html',
  styleUrls: ['./admin-contacts-list.component.css']
})
export class AdminContactsListComponent implements OnInit {
  private configSuccess: MatSnackBarConfig = {
    panelClass: ['style-success'],
    duration: 4000,
    horizontalPosition: 'center' ,
    verticalPosition: 'top'
  };
  contacts: Contact[] = [];
  columnsToDisplay: string[] = ['hospitalName', 'name', 'email', 'phone', 'actions'];
  dataSource: MatTableDataSource<Contact>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  isLoadingResults = true;

  constructor(private snackBar: MatSnackBar,
              private contactService: ContactService) { }

  ngOnInit(): void {

    this.contactService.getAll()
    .subscribe((res: any) => {
      this.contacts = res;
      this.isLoadingResults = false;
      this.dataSource = new MatTableDataSource(this.contacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });

  }

  markAsReadContact(contactId: string) {
    this.contactService.markAsReadContact(contactId).subscribe(data => {
      this.ngOnInit();
    });
  }

  deleteContact(contactId: string) {
    this.contactService.deleteContact(contactId).subscribe(data => {
      this.openSnackBarSuccess('Supprimé');
      this.ngOnInit();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openSnackBarSuccess(message: string) {
    this.snackBar.open(message, 'fermer', this.configSuccess);
  }

}


