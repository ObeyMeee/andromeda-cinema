import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {CarouselModule} from "primeng/carousel";
import {PosterComponent} from './poster/poster.component';
import {HttpClientModule} from "@angular/common/http";
import {BlurDirective} from './poster/blur.directive';
import {Route, RouterModule} from "@angular/router";
import {FilmComponent} from './film/film.component';
import { HallComponent } from './hall/hall.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./config/keycloak-init.factory";

const routes: Route[] = [
  {path: '', component: PosterComponent, pathMatch: 'full'},
  {path: 'films/:id', component: FilmComponent},
  {path: 'films/:id/sessions/:sessionId', component: HallComponent},
  {path: '**', component: PosterComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PosterComponent,
    BlurDirective,
    FilmComponent,
    HallComponent
  ],
  imports: [
    BrowserModule,
    CarouselModule,
    HttpClientModule,
    KeycloakAngularModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
