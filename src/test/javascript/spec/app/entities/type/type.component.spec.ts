import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EBraireTestModule } from '../../../test.module';
import { TypeComponent } from 'app/entities/type/type.component';
import { TypeService } from 'app/entities/type/type.service';
import { Type } from 'app/shared/model/type.model';

describe('Component Tests', () => {
  describe('Type Management Component', () => {
    let comp: TypeComponent;
    let fixture: ComponentFixture<TypeComponent>;
    let service: TypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [TypeComponent],
      })
        .overrideTemplate(TypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Type(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.types && comp.types[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
