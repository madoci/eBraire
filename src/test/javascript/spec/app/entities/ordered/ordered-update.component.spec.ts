import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EBraireTestModule } from '../../../test.module';
import { OrderedUpdateComponent } from 'app/entities/ordered/ordered-update.component';
import { OrderedService } from 'app/entities/ordered/ordered.service';
import { Ordered } from 'app/shared/model/ordered.model';

describe('Component Tests', () => {
  describe('Ordered Management Update Component', () => {
    let comp: OrderedUpdateComponent;
    let fixture: ComponentFixture<OrderedUpdateComponent>;
    let service: OrderedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [OrderedUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(OrderedUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderedUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderedService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Ordered(123);
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
        const entity = new Ordered();
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
