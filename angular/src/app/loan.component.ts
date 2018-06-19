import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as xml2js from 'xml2js';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'loan-landing',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
  providers: [
  LoanService]
})

export class LoanComponent{

  loan;


 constructor(private router: Router,
 private loanService: LoanService) {}

  ngOnInit() {

    this.getLoan01();
 }

 private getLoanDetails(){

    this.router.navigate(['/details']);

  };

  fileUpload($event): void {
            this.readThis($event.target);
        };

  readThis(inputValue: any): void {
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();
        var fileType = inputValue.parentElement.id;
        myReader.onloadend = function (e) {
            //myReader.result is a String of the uploaded file
            console.log(myReader.result);
            var string:String = myReader.result;
             console.log(string);
              xml2js.parseString( string, function (err, result) {

            console.dir(result); // Prints JSON object!
            console.log(result.note.to);
         });
        }

        myReader.readAsText(file);
    };

     public getLoan01() {
    try {
      this.loanService.getLoan('LOAN01')
        .subscribe(resp => {
          console.log(resp, "res");
          this.loan = resp
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  };


}
