import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrdered } from 'app/shared/model/ordered.model';

@Component({
  selector: 'jhi-ordered-detail',
  templateUrl: './ordered-detail.component.html',
})
export class OrderedDetailComponent implements OnInit {
  ordered: IOrdered | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordered }) => (this.ordered = ordered));
  }

  previousState(): void {
    window.history.back();
  }
}
