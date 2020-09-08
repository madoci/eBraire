import { TypeService } from './../../entities/type/type.service';
import { GenreService } from './../../entities/genre/genre.service';
import { TagService } from './../../entities/tag/tag.service';
import { Type, IType } from './../../shared/model/type.model';
import { Genre, IGenre } from './../../shared/model/genre.model';
import { Tag, ITag } from './../../shared/model/tag.model';
import { IBook, Book } from './../../shared/model/book.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../entities/book/book.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-managebook',
  templateUrl: './managebook.component.html',
})
export class ManagebookComponent implements OnInit {
  id?: string | null;
  book?: IBook | null;
  isSaving = false;
  newBook = true;

  // Variables en plus necessaire à afficher correctement les champs
  types: Type[];
  tags: Tag[];
  genres: Genre[];

  constructor(
    private route: ActivatedRoute,
    protected bookService: BookService,
    protected typeService: TypeService,
    protected genreService: GenreService,
    protected tagService: TagService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params) {
        this.id = params.get('id');
      }
    });
    this.bookService.find(+(this.id || '-1')).subscribe(book => {
      if (book.body) {
        this.newBook = false;
      }
      this.book = book.body;
      // const tempBook = this.book || new Book();
    });
    this.book = this.book || new Book();

    // Types
    this.typeService.query().subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));

    // Genres
    this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));

    // Tags
    this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => (this.tags = res.body || []));
  }

  save(): void {
    this.isSaving = true;
    if (this.newBook) {
      this.subscribeToSaveResponse(this.bookService.create(this.book || new Book()));
    } else {
      this.subscribeToSaveResponse(this.bookService.update(this.book || new Book()));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  previousState(): void {
    window.history.back();
  }
}
