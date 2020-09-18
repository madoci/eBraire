import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EBraireTestModule } from '../../../test.module';
import { BookedBookDetailComponent } from 'app/entities/booked-book/booked-book-detail.component';
import { BookedBook } from 'app/shared/model/booked-book.model';

describe('Component Tests', () => {
  describe('BookedBook Management Detail Component', () => {
    let comp: BookedBookDetailComponent;
    let fixture: ComponentFixture<BookedBookDetailComponent>;
    const route = ({ data: of({ bookedBook: new BookedBook(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [BookedBookDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(BookedBookDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookedBookDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bookedBook on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bookedBook).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
