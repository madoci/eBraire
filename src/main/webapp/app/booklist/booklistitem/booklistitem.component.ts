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
    let dec = Math.trunc((val - Math.trunc(val)) * 10).toString()[0] + Math.trunc((val - Math.trunc(val)) * 10 * 100).toString()[0];
    if (dec === '0') {
      dec = '00';
    }
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
