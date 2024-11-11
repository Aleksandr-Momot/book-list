import { Component, Inject } from '@angular/core';
import { Book } from '../../interfaces'; 

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-details-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './book-details-dialog.component.html',
  styleUrl: './book-details-dialog.component.scss'
})
export class BookDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {}

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public editBook(): void {
    this.dialogRef.close({ action: 'edit', book: this.data.book });
  }

  public deleteBook(): void {
    this.dialogRef.close({ action: 'delete', bookId: this.data.book.id });
  }
}
