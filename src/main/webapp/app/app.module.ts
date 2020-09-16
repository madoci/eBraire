import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EBraireSharedModule } from 'app/shared/shared.module';
import { EBraireCoreModule } from 'app/core/core.module';
import { EBraireAppRoutingModule } from './app-routing.module';
import { EBraireHomeModule } from './home/home.module';
import { EBraireEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { BookdialogdeleteComponent } from './admin/bookdialogdelete/bookdialogdelete.component';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';

@NgModule({
  imports: [
    BrowserModule,
    EBraireSharedModule,
    EBraireCoreModule,
    EBraireHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EBraireEntityModule,
    EBraireAppRoutingModule,
    ShoppingCartModule,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    BookdialogdeleteComponent,
  ],
  bootstrap: [MainComponent],
})
export class EBraireAppModule {}
