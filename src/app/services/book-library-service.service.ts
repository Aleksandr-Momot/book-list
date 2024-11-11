import { Injectable } from '@angular/core';
import { Book } from '../interfaces';
import { BehaviorSubject, delay, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookLibraryServiceService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.booksSubject.asObservable();
  public loading$ = new BehaviorSubject<boolean>(true); 
  constructor(
    private http: HttpClient
  ) {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.http.get<Book[]>('../../assets/books.json')
      .pipe(
        delay(3000),
        tap(books => {
          this.booksSubject.next(books);
          this.loading$.next(false);
        })
      )
      .subscribe();
  }

  public editBook(updatedBook: Book): void {
    const updatedBooks = this.booksSubject.getValue().map(book =>
      book.id === updatedBook.id ? { ...book, ...updatedBook } : book
    );
    this.booksSubject.next(updatedBooks);
  }

  public addBook(book: Book): void {
    const currentBooks = this.booksSubject.getValue();
    const newId = currentBooks.length ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
    const bookWithId = { ...book, id: newId };
    const updatedBooks = [...currentBooks, bookWithId];
    this.booksSubject.next(updatedBooks);
  }
  
  public deleteBook(id: number): void {
    const currentBooks = this.booksSubject.getValue();
    const updatedBooks = currentBooks.filter(book => book.id !== id);
    this.booksSubject.next(updatedBooks);
  }
}
