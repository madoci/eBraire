import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../entities/book/book.service';
import { TypeService } from '../../entities/type/type.service';
import { GenreService } from '../../entities/genre/genre.service';
import { TagService } from '../../entities/tag/tag.service';
import { HttpResponse } from '@angular/common/http';
import { IType, Type } from '../../shared/model/type.model';
import { IGenre, Genre } from '../../shared/model/genre.model';
import { ITag, Tag } from '../../shared/model/tag.model';

@Component({
  selector: 'jhi-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  currentSearch: String = '';
  types?: Type[];
  tags?: Tag[];
  genres?: Genre[];
  selectedTags: String = '';
  selectedGenres: String = '';
  selectedTypes: String = '';

  // Style
  cat = false;
  gen = false;
  tag = false;

  constructor(
    private route: ActivatedRoute,
    protected bookService: BookService,
    protected typeService: TypeService,
    protected genreService: GenreService,
    protected tagService: TagService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.currentSearch = params['search'];
      this.selectedTypes = params['types'];
      this.selectedGenres = params['genres'];
      this.selectedTags = params['tags'];
      if (this.selectedTypes === 'types-' && this.selectedGenres === 'genres-' && this.selectedTags === 'tags-') this.uncheckAll();
    });
    // Types
    this.typeService.query().subscribe((res: HttpResponse<IType[]>) => (this.types = res.body || []));

    // Genres
    this.genreService.query().subscribe((res: HttpResponse<IGenre[]>) => (this.genres = res.body || []));

    // Tags
    this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => (this.tags = res.body || []));
  }
  uncheckAll(): void {
    // Save Tags
    const checkedListTag = document.getElementsByName('tag');
    checkedListTag.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      check.checked = false;
    });
    // Save Genres
    const checkedListGenre = document.getElementsByName('genre');
    checkedListGenre.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      check.checked = false;
    });
    // Save types
    const checkedListType = document.getElementsByName('type');
    checkedListType.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      check.checked = false;
    });
  }

  research(): void {
    // Save Tags
    const checkedListTag = document.getElementsByName('tag');
    this.selectedTags = '';
    checkedListTag.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      if (check.checked) {
        if (element.childNodes[3].textContent) {
          this.selectedTags += (element.childNodes[3].textContent || '') + '&';
        }
      }
    });
    // Save Genres
    const checkedListGenre = document.getElementsByName('genre');
    this.selectedGenres = '';
    checkedListGenre.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      if (check.checked) {
        if (element.childNodes[3].textContent) {
          this.selectedGenres += (element.childNodes[3].textContent || '') + '&';
        }
      }
    });
    // Save types
    const checkedListType = document.getElementsByName('type');
    this.selectedTypes = '';
    checkedListType.forEach(element => {
      const check = element.childNodes[1] as HTMLInputElement;
      if (check.checked) {
        this.selectedTypes += (element.childNodes[3].textContent || '') + '&';
      }
    });
    if (this.selectedGenres === undefined) this.selectedGenres = '';
    if (this.selectedTags === undefined) this.selectedTags = '';
    if (this.selectedTypes === undefined) this.selectedTypes = '';
    this.router.navigateByUrl(
      '/catalogue/' + this.currentSearch + '/types-' + this.selectedTypes + '/genres-' + this.selectedGenres + '/tags-' + this.selectedTags
    );
  }
}
