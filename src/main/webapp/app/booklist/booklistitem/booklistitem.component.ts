import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../shared/model/book.model';

@Component({
  selector: 'jhi-booklistitem',
  templateUrl: './booklistitem.component.html',
  styleUrls: ['./booklistitem.component.scss'],
})
export class BooklistitemComponent implements OnInit {
  @Input() myBook!: Book;
  constructor() {}

  ngOnInit(): void {}

  price(val: number | undefined): string {
    if (val === undefined) return '0.00€';
    const dec = Math.round((val - Math.floor(val)) * 100).toString();
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
