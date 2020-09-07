import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IBook, Book } from 'app/shared/model/book.model';
import { BookService } from './book.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IType } from 'app/shared/model/type.model';
import { TypeService } from 'app/entities/type/type.service';
import { ITag } from 'app/shared/model/tag.model';
import { TagService } from 'app/entities/tag/tag.service';
import { IGenre } from 'app/shared/model/genre.model';
import { GenreService } from 'app/entities/genre/genre.service';

type SelectableEntity = IType | ITag | IGenre;

type SelectableManyToManyEntity = ITag | IGenre;

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;
  types: IType[] = [];
  tags: ITag[] = [];
  genres: IGenre[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    authors: [],
    description: [],
    descriptionContentType: [],
    unitPrice: [],
    image: [],
    imageContentType: [],
    type: [],
    tags: [],
    genres: [],
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected bookService: BookService,
    protected typeService: TypeService,
    protected tagService: TagService,
    protected genreService: GenreService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      this.updateForm(book);

      this.typeService.query().subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));

      this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => (this.tags = res.body || []));

      this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));
    });
  }

  updateForm(book: IBook): void {
    this.editForm.patchValue({
      id: book.id,
      title: book.title,
      authors: book.authors,
      description: book.description,
      descriptionContentType: book.descriptionContentType,
      unitPrice: book.unitPrice,
      image: book.image,
      imageContentType: book.imageContentType,
      type: book.type,
      tags: book.tags,
      genres: book.genres,
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('eBraireApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  private createFromForm(): IBook {
    return {
      ...new Book(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      authors: this.editForm.get(['authors'])!.value,
      descriptionContentType: this.editForm.get(['descriptionContentType'])!.value,
      description: this.editForm.get(['description'])!.value,
      unitPrice: this.editForm.get(['unitPrice'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      type: this.editForm.get(['type'])!.value,
      tags: this.editForm.get(['tags'])!.value,
      genres: this.editForm.get(['genres'])!.value,
    };
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: SelectableManyToManyEntity[], option: SelectableManyToManyEntity): SelectableManyToManyEntity {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
