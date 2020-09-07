import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EBraireTestModule } from '../../../test.module';
import { OrderedComponent } from 'app/entities/ordered/ordered.component';
import { OrderedService } from 'app/entities/ordered/ordered.service';
import { Ordered } from 'app/shared/model/ordered.model';

describe('Component Tests', () => {
  describe('Ordered Management Component', () => {
    let comp: OrderedComponent;
    let fixture: ComponentFixture<OrderedComponent>;
    let service: OrderedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [OrderedComponent],
      })
        .overrideTemplate(OrderedComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderedComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderedService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Ordered(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.ordereds && comp.ordereds[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
