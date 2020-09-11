import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  currentSearch: String = '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentSearch = params['search'];
    });
  }
}
