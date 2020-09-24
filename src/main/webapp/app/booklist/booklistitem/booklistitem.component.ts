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
    const decArray = val.toString().split('.');
    let dec = '00';
    if (decArray.length === 1) {
      dec = '00';
    } else {
      dec = decArray[1].substring(0, 2);
      if (dec.length === 1) {
        dec = dec + '0';
      }
    }
    return Math.trunc(val).toString() + ',' + dec + '€';
  }
}
