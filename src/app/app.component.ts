import { Component } from '@angular/core';
import { BookListComponent } from "./components/book-list/book-list.component";
import { BookLibraryServiceService } from './services/book-library-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    BookLibraryServiceService
  ]
})
export class AppComponent {
  title = 'Booklibrary';
}
