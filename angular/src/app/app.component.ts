import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InitialService } from '../services/initialize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [InitialService]
})
export class AppComponent implements OnInit{
  title = 'app';
  data: any = [];

 constructor(private router: Router,
 public initialService: InitialService
 ) {}

 ngOnInit() {
    this.initialize();
  }

  private getLoanDetails(){

    this.router.navigate(['/details']);

  };

  public initialize() {
    try {
      this.initialService.initialize()
        .subscribe(resp => {
          console.log(resp, "res");
          this.data = resp
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  };


}
