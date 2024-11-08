import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../interfaces';

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


  closeDialog(): void {
    this.dialogRef.close();
  }

  editBook(): void {
    this.dialogRef.close({ action: 'edit', book: this.data.book });
  }

  deleteBook(): void {
    this.dialogRef.close({ action: 'delete', bookId: this.data.book.id });
  }
}
