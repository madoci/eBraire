import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGenre } from 'app/shared/model/genre.model';
import { GenreService } from './genre.service';
import { GenreDeleteDialogComponent } from './genre-delete-dialog.component';

@Component({
  selector: 'jhi-genre',
  templateUrl: './genre.component.html',
})
export class GenreComponent implements OnInit, OnDestroy {
  genres?: IGenre[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected genreService: GenreService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.genreService
        .search({
          query: this.currentSearch,
        })
        .subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));
      return;
    }

    this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInGenres();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IGenre): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInGenres(): void {
    this.eventSubscriber = this.eventManager.subscribe('genreListModification', () => this.loadAll());
  }

  delete(genre: IGenre): void {
    const modalRef = this.modalService.open(GenreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.genre = genre;
  }
}
