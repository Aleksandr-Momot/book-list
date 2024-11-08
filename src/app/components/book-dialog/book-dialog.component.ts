import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatDialogModule 
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss'
})
export class BookDialogComponent {
  bookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book | null }
  ) {
    this.bookForm = this.fb.group({
      title: [data.book?.title || '', [Validators.required]],
      author: [data.book?.author || '', [Validators.required]],
      year: [data.book?.year || '', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      description: [data.book?.description || ''],
      id: [data.book?.id || ''],
    });
  }

  onSave(): void {
    if (this.bookForm.valid) {
      this.dialogRef.close(this.bookForm.value);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
