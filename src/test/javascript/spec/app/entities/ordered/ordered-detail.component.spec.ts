import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EBraireTestModule } from '../../../test.module';
import { OrderedDetailComponent } from 'app/entities/ordered/ordered-detail.component';
import { Ordered } from 'app/shared/model/ordered.model';

describe('Component Tests', () => {
  describe('Ordered Management Detail Component', () => {
    let comp: OrderedDetailComponent;
    let fixture: ComponentFixture<OrderedDetailComponent>;
    const route = ({ data: of({ ordered: new Ordered(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EBraireTestModule],
        declarations: [OrderedDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(OrderedDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderedDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ordered on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ordered).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
