import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../shared/model/book.model';
import { JhiDataUtils } from 'ng-jhipster';

@Component({
  selector: 'jhi-booklistitem',
  templateUrl: './booklistitem.component.html',
  styleUrls: ['./booklistitem.component.scss'],
})
export class BooklistitemComponent implements OnInit {
  @Input() myBook!: Book;
  imageBlobUrl: String = '';
  constructor(protected dataUtils: JhiDataUtils) {}

  ngOnInit(): void {
    this.imageBlobUrl = 'data:' + this.myBook.imageContentType + ';base64,' + this.myBook.image;
  }
}
