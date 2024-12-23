import { FormControl } from "@angular/forms";

export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description?: string;
    imageUrl: string;
}

export interface BookForm {
    title: FormControl<string>;
    author: FormControl<string>;
    year: FormControl<number | null>;
    description: FormControl<string>;
    id: FormControl<number | null>;
    imageUrl: FormControl<string>;
  }