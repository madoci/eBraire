import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EBraireTestModule } from '../../../test.module';
import { BookedBookUpdateComponent } from 'app/entities/booked-book/booked-book-update.component';
import { BookedBookService } from 'app/entities/booked-book/booked-book.service';
import { BookedBook } from 'app/shared/model/booked-book.model';

describe('Component Tests', () => {
  describe('BookedBook Management Update Component', () => {
    let comp: BookedBookUpdateComponent;
    let fixture: ComponentFixture<BookedBookUpdateComponent>;
    let service: BookedBookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [BookedBookUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(BookedBookUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookedBookUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BookedBookService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new BookedBook(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new BookedBook();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
