import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookLibraryServiceService } from '../../services/book-library-service.service';
import { Book } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookDetailsDialogComponent } from '../book-details-dialog/book-details-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatFormFieldModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  animations: [
    trigger('deleteAnimation', [
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class BookListComponent implements OnInit, OnDestroy  {
  private destroy$ = new Subject<void>();
  public books: Book[] = [];
  public displayedColumns: string[] = ['title', 'author', 'year', 'actions'];
  public searchQuery: string = ''; 
  public filteredBooks: Book[] = [];
  public loading$: Observable<boolean>
  constructor(
    private bookService: BookLibraryServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getBooksList();
  }

  public trackByFn(index: number, item: Book): number {
    return item.id;
  }

  private getBooksList(): void {
    this.loading$ = this.bookService.loading$;
    this.bookService.books$
    .pipe(takeUntil(this.destroy$))
    .subscribe((books: Book[]) => {
      this.books = books;
      this.filterBooks();
    });
  }

  public openDialog(book: Book | null): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: { book }
    });
    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      if (result) {
        if (book) {
          this.bookService.editBook(result);
        } else {
          this.bookService.addBook(result);
        }
      }
    });
  }

  public openBookDetails(book: Book): void {
    const dialogRef = this.dialog.open(BookDetailsDialogComponent, {
      data: { book }
    });
    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      if (result?.action === 'edit') {
        this.openDialog(result.book);
      } else if (result?.action === 'delete') {
        this.deleteBook(result.bookId); 
      }
    });
  }

  public filterBooks(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredBooks = this.books;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredBooks = this.books.filter(
        book => book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }
  }

  public editBook(book: Book): void {
    const bookToEdit = { ...book };
    this.openDialog(bookToEdit);
  }

  public deleteBook(bookId: number): void {
    if (confirm('Ви впевнені, що хочете видалити цю книгу?')) {
      this.bookService.deleteBook(bookId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
