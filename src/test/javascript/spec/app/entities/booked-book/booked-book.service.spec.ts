import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { BookedBookService } from 'app/entities/booked-book/booked-book.service';
import { IBookedBook, BookedBook } from 'app/shared/model/booked-book.model';

describe('Service Tests', () => {
  describe('BookedBook Service', () => {
    let injector: TestBed;
    let service: BookedBookService;
    let httpMock: HttpTestingController;
    let elemDefault: IBookedBook;
    let expectedResult: IBookedBook | IBookedBook[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(BookedBookService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new BookedBook(0, currentDate, 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            expired: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BookedBook', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            expired: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            expired: currentDate,
          },
          returnedFromService
        );

        service.create(new BookedBook()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BookedBook', () => {
        const returnedFromService = Object.assign(
          {
            expired: currentDate.format(DATE_FORMAT),
            quantity: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            expired: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BookedBook', () => {
        const returnedFromService = Object.assign(
          {
            expired: currentDate.format(DATE_FORMAT),
            quantity: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            expired: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BookedBook', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
