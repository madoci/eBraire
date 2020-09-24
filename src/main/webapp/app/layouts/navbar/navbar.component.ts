import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/core/language/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { LoginService } from 'app/core/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  swaggerEnabled?: boolean;
  version: string;
  currentSearch!: String;
  types: String = 'types-';
  genres: String = 'genres-';
  tags: String = 'tags-';
  name: String = 'Compte';
  constructor(
    private loginService: LoginService,
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
    this.update();
    this.eventManager.subscribe('CloseConnection', () => this.update());
  }

  update(): void {
    this.accountService
      .identity()
      .pipe(
        map(account => {
          if (account) {
            this.name = account.firstName + ' ' + account.lastName;
            return;
          }
          return;
        })
      )
      .subscribe();
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  logout(): void {
    this.name = 'Compte';
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : '';
  }

  loadAll(): void {}

  search(query: String): void {
    if (query === '' || query === undefined) {
      this.router.navigateByUrl('/catalogue/title-/' + this.types + '/' + this.genres + '/' + this.tags);
    } else {
      this.router.navigateByUrl('/catalogue/title-' + query + '/' + this.types + '/' + this.genres + '/' + this.tags);
    }
    this.loadAll();
  }
}
