import { Injectable } from '@angular/core';
import { Book } from '../interfaces';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookLibraryServiceService {
  private books: Book[] = [
    { id: 1, title: 'Book 1', author: 'Author 1', year: 2021, description: 'Lorem 1' },
    { id: 2, title: 'Book 2', author: 'Author 2', year: 2022, description: 'Lorem 2' },
    { id: 3, title: 'Book 3', author: 'Author 3', year: 2023, description: 'Lorem 3' },
    { id: 4, title: 'Book 4', author: 'Author 4', year: 2053, description: 'Lorem 4' },
    { id: 5, title: 'Book 5', author: 'Author 5', year: 2073, description: 'Lorem 5' }
  ];
  private booksSubject = new BehaviorSubject<Book[]>(this.books);
  public books$ = this.booksSubject.asObservable();

  constructor() {}

  editBook(updatedBook: Book): void {
    const index = this.books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updatedBook };
      this.booksSubject.next([...this.books]);
    }
  }

  addBook(newBook: Book): void {
    newBook.id = this.books.length + 1;
    this.books.push(newBook);
    this.booksSubject.next([...this.books]);
  }

  deleteBook(bookId: number): void {
    this.books = this.books.filter(book => book.id !== bookId);
    this.booksSubject.next([...this.books]);
  }
}
