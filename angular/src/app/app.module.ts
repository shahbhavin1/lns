import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { DetailsComponent }  from './details.component';
import { LoanComponent }  from './loan.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { InitialService } from '../services/initialize.service';
import { LoanService } from '../services/loan.service';
import { HttpClientModule } from  '@angular/common/http';

export const ROUTES: Routes = [
  { path: '',component: AppComponent },
  { path: 'home',component: LoanComponent },
  { path: 'details', component: DetailsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    LoanComponent,
    DetailsComponent,
    FileSelectDirective
  ],
  imports: [
   BrowserModule,
   RouterModule.forRoot(ROUTES),
   FormsModule,
   HttpClientModule
   ],
  bootstrap: [AppComponent],
  providers: [
  AppService,
  InitialService,
  LoanService],
})
export class AppModule { }
