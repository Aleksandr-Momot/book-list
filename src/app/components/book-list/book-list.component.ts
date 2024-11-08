import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookLibraryServiceService } from '../../services/book-library-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../interfaces';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { trigger, transition, style, animate } from '@angular/animations';
import { BookDetailsDialogComponent } from '../book-details-dialog/book-details-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    MatTableModule, 
    CommonModule, 
    MatFormFieldModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit, OnDestroy  {
  private destroy$ = new Subject<void>();
  public books: Book[] = [];
  public displayedColumns: string[] = ['title', 'author', 'year', 'actions'];
  public searchQuery: string = ''; 
  public filteredBooks: Book[] = [];
  constructor(
    private bookService: BookLibraryServiceService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getBooksList();
  }

  trackByBookId(index: number, book: Book): number {
    return book.id as any;
  }

  getBooksList() {
    this.bookService.books$
    .pipe(takeUntil(this.destroy$))
    .subscribe((books: Book[]) => {
      this.books = books;
      this.filterBooks();
    });
  }

  openDialog(book: Book | null): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: { book }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (book) {
          this.bookService.editBook(result);
        } else {
          this.bookService.addBook(result);
        }
      }
    });
  }

  openBookDetails(book: Book): void {
    const dialogRef = this.dialog.open(BookDetailsDialogComponent, {
      data: { book }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        this.openDialog(result.book);
      } else if (result?.action === 'delete') {
        this.deleteBook(result.bookId); 
      }
    });
  }

  filterBooks(): void {
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

  editBook(book: Book): void {
    const bookToEdit = { ...book };
    this.openDialog(bookToEdit);
  }

  deleteBook(bookId: number): void {
    if (confirm('Ви впевнені, що хочете видалити цю книгу?')) {
      this.bookService.deleteBook(bookId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
