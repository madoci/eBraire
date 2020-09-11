import { TypeService } from './../../entities/type/type.service';
import { GenreService } from './../../entities/genre/genre.service';
import { TagService } from './../../entities/tag/tag.service';
import { IType } from './../../shared/model/type.model';
import { IGenre } from './../../shared/model/genre.model';
import { ITag } from './../../shared/model/tag.model';
import { Component, OnInit } from '@angular/core';
import { IBook, Book } from '../../shared/model/book.model';
import { BookService } from '../../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookdialogdeleteComponent } from '../bookdialogdelete/bookdialogdelete.component';

@Component({
  selector: 'jhi-adminpanel',
  templateUrl: './adminpanel.component.html',
})
export class AdminpanelComponent implements OnInit {
  sending = false;
  count = 0;
  numGenerate = 10;
  books: IBook[] = [];
  types?: IType[];
  genres?: IGenre[];
  tags?: ITag[];

  constructor(
    protected modalService: NgbModal,
    private bookService: BookService,
    protected typeService: TypeService,
    protected genreService: GenreService,
    protected tagService: TagService
  ) {}

  ngOnInit(): void {
    this.bookService.query().subscribe((res: HttpResponse<IBook[]>) => (this.books = res.body || []));
    // Genres
    this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => {
      this.genres = res.body || [];
    });
    // Tags
    this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => {
      this.tags = res.body || [];
    });
    // Types
    this.typeService.query().subscribe((res: HttpResponse<IType[]>) => {
      this.types = res.body || [];
    });
  }
  delete(book: IBook): void {
    const modalRef = this.modalService.open(BookdialogdeleteComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.book = book;
  }

  generate(): void {
    if (this.sending) return;
    this.sending = true;
    for (let i = 0; i < this.numGenerate; i++) {
      const book = new Book();
      book.title = this.makeid(10);
      book.authors = this.makeid(10);
      book.description = this.makeid(Math.random() * 1000);
      book.unitPrice = Math.floor(Math.random() * 20);
      const b = this.books[0];
      book.imageContentType = 'image/png';
      book.image = b.image;
      book.genres = [this.genres![Math.floor(Math.random() * this.genres!.length)]];
      book.tags = [this.tags![Math.floor(Math.random() * this.tags!.length)]];
      book.type = this.types![Math.floor(Math.random() * this.types!.length)];
      this.bookService.create(book).subscribe(() => {
        if (i === this.numGenerate - 1) {
          window.location.reload();
        }
      });
    }
  }

  makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  limit(l: string | undefined): string {
    if (l === undefined) return '';
    if (l.length < 10) return l;
    return l.substr(0, 10) + '...';
  }
}
