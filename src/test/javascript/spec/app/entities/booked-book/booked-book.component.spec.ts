import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EBraireTestModule } from '../../../test.module';
import { BookedBookComponent } from 'app/entities/booked-book/booked-book.component';
import { BookedBookService } from 'app/entities/booked-book/booked-book.service';
import { BookedBook } from 'app/shared/model/booked-book.model';

describe('Component Tests', () => {
  describe('BookedBook Management Component', () => {
    let comp: BookedBookComponent;
    let fixture: ComponentFixture<BookedBookComponent>;
    let service: BookedBookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [BookedBookComponent],
      })
        .overrideTemplate(BookedBookComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookedBookComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BookedBookService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new BookedBook(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bookedBooks && comp.bookedBooks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
