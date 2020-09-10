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
import { JhiDataUtils, JhiFileLoadError, JhiEventWithContent, JhiEventManager } from 'ng-jhipster';
import { FormBuilder } from '@angular/forms';
import { AlertError } from 'app/shared/alert/alert-error.model';

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
  types?: Type[];
  tags?: Tag[];
  genres?: Genre[];

  tagList: number[] = [];
  genreList: number[] = [];
  urlImage?: string;

  editForm = this.fb.group({
    id: [],
    title: [],
    authors: [],
    description: [],
    unitPrice: [],
    image: [],
    imageContentType: [],
    type: [],
    tags: [],
    genres: [],
  });

  constructor(
    private route: ActivatedRoute,
    protected bookService: BookService,
    protected typeService: TypeService,
    protected genreService: GenreService,
    protected tagService: TagService,
    protected dataUtils: JhiDataUtils,
    private fb: FormBuilder,
    protected eventManager: JhiEventManager
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
      const tempBook = this.book || new Book();

      const tagListBook = tempBook.tags || [];
      tagListBook.forEach(element => {
        this.tagList.push((element || new Tag()).id || 0);
      });
      const genreListBook = tempBook.genres || [];
      genreListBook.forEach(element => {
        this.genreList.push((element || new Genre()).id || 0);
      });

      this.urlImage = 'data:' + tempBook.imageContentType + ';base64,' + tempBook.image;
    });
    this.book = this.book || new Book();

    this.editForm.patchValue({
      id: this.book.id,
      title: this.book.title,
      authors: this.book.authors,
      description: this.book.description,
      unitPrice: this.book.unitPrice,
      image: this.book.image,
      imageContentType: this.book.imageContentType,
      type: this.book.type,
      tags: this.book.tags,
      genres: this.book.genres,
    });

    // Types
    this.typeService.query().subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));

    // Genres
    this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));

    // Tags
    this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => (this.tags = res.body || []));
  }

  save(): void {
    this.isSaving = true;

    // Save Tags
    const checkedListTag = document.getElementsByName('tag');
    const savingTagString: string[] = [];
    checkedListTag.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      if (check.checked) {
        savingTagString.push(element.childNodes[3].textContent || '');
      }
    });
    const savingTag: Tag[] = [];
    savingTagString.forEach(element => {
      for (let i = 0; i < this.tags!.length; i++) {
        if (element === this.tags![i].tag) {
          savingTag.push(this.tags![i]);
        }
      }
    });
    this.book!.tags = savingTag;

    // Save Genres
    const checkedListGenre = document.getElementsByName('genre');
    const savingGenreString: string[] = [];
    checkedListGenre.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      if (check.checked) {
        savingGenreString.push(element.childNodes[3].textContent || '');
      }
    });
    const savingGenre: Tag[] = [];
    savingGenreString.forEach(element => {
      for (let i = 0; i < this.genres!.length; i++) {
        if (element === this.genres![i].genre) {
          savingGenre.push(this.genres![i]);
        }
      }
    });
    this.book!.genres = savingGenre;

    // Save image
    this.book!.image = this.editForm.get(['image'])!.value;
    this.book!.imageContentType = this.editForm.get(['imageContentType'])!.value;
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

  contain(value: number): boolean {
    for (let i = 0; i < this.tagList.length; i++) {
      if (this.tagList[i] === value) return true;
    }
    return false;
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('eBraireApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }
}
