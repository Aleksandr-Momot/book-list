export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description?: string;
    imageUrl?: string;
}