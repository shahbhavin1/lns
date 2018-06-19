import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DetailsComponent }  from './details.component';

export const ROUTES: Routes = [
  {
    path: 'home',
    component: AppComponent,
    children: [
      { path: 'details', component: DetailsComponent },
    ],
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(ROUTES)],
  bootstrap: [AppComponent],
  declarations: [AppComponent],
})
export class AppModule {}
