import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book, BookForm } from '../../interfaces';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
export class BookDialogComponent implements OnInit {
  public bookForm: FormGroup<BookForm>;
  public coverPreview: string | null = null;
  public data: {book: Book} = inject(MAT_DIALOG_DATA)

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data?.book) {
      this.patchBookForm(this.data.book)
    }
  }

  public initForm(): void {
    this.bookForm = this.fb.group<BookForm>({
      title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      author: this.fb.control( '', { nonNullable: true, validators: [Validators.required] }),
      year: this.fb.control(null, [Validators.required, Validators.pattern('^[0-9]{4}$')]),
      description: this.fb.control('', { nonNullable: true }),
      id: this.fb.control(null),
      imageUrl: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  public patchBookForm(data: Book): void {
    this.bookForm.patchValue(data)
  }

  public onCoverSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
      this.coverPreview = reader.result as string;
      this.bookForm.patchValue({ imageUrl: this.coverPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  public onSave(): void {
    if (this.bookForm.valid) {
      this.dialogRef.close(this.bookForm.value);
    }
  }
  
  public onCancel(): void {
    this.dialogRef.close();
  }
}
