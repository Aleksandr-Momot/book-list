import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../interfaces';
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
export class BookDialogComponent {
  public bookForm: FormGroup;
  public coverPreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {
    this.bookForm = this.fb.group({
      title: new FormControl<string>(data.book?.title || '', [Validators.required]),
      author: new FormControl<string>(data.book?.author || '', [Validators.required]),
      year: new FormControl<number | null>(data.book?.year || null, [Validators.required, Validators.pattern('^[0-9]{4}$')]),
      description: new FormControl<string>(data.book?.description || ''),
      id: new FormControl<number | null>(data.book?.id || null),
      imageUrl: new FormControl<string>(data.book?.imageUrl || '', [Validators.required]),
    });
    if (data.book?.imageUrl) {
      this.coverPreview = data.book.imageUrl;
    }
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
