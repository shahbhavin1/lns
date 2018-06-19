/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /* global getParticipantRegistry getAssetRegistry getFactory */

 /**
  * Accept the loan from servicer
  * @param {org.fanniemae.loan.InsertLoan} insertLoan
  * @transaction
  */
 async function insertLoan(insertLoan) {
  console.log(insertLoan.loan);
}

/**
* Accept the loan from servicer
* @param {org.fanniemae.loan.AcceptLoan} acceptLoan
* @transaction
*/
async function acceptLoan(acceptLoan) {
  console.log(acceptLoan);
  const loan = acceptLoan.loan;
  loan.onBoardingStatus = 'ACCEPTED';
  const loanRegistry = await getAssetRegistry('org.fanniemae.loan.Loan');
  await loanRegistry.update(loan);
}

/**
* Reject the loan from Servicer.
* @param {org.fanniemae.loan.RejectLoan} loan
* @transaction
*/
async function rejectLoan(rejectLoan) {
  console.log(rejectLoan);
  const loan = rejectLoan.loan;
  loan.onBoardingStatus = 'REJECTED';
  const loanRegistry = await getAssetRegistry('org.fanniemae.loan.Loan');
  await loanRegistry.update(loan);
}

/**
 * @param {org.fanniemae.loan.RecordPayment} loan
 * @transaction
 */
async function recordPayment(recordPayment) {
  console.log(recordPayment);
  const loan = recordPayment.loan;
  if (loan.onBoardingStatus != 'ACCEPTED') {
    throw new Error('Can not submit payment for non accepted Loan');
  }
  if (loan.payments) {
    loan.payments.push(recordPayment);
  } else {
       loan.payments = [recordPayment];
  }
  const loanRegistry = await getAssetRegistry('org.fanniemae.loan.Loan');
  await loanRegistry.update(loan);
}

/* Insert initial Participant for ease of testing.
*  @param {org.fanniemae.loan.InsertInitialParticipant} insertInitialParticipant
*  @transaction
*/
async function insertInitialParticipant(insertInitialParticipant) {
  const factory = new getFactory();
  const namespace = 'org.fanniemae.loan';
  
  // Add servicers
  const chaseServicer = factory.newResource(namespace, 'Servicer', 'Chase');
  chaseServicer.lenderMarkingId = 'ChaseMarketingID';

  const wellsFargoServicer = factory.newResource(namespace, 'Servicer', 'WellsFargo');
  wellsFargoServicer.lenderMarkingId = 'WellsFargoMarketingID';
  
  const boaServicer = factory.newResource(namespace, 'Servicer', 'BoA');
  boaServicer.lenderMarkingId = 'BoAMarketingID';

  const servicerRegistry = await getParticipantRegistry(namespace + '.Servicer');
  await servicerRegistry.addAll([chaseServicer, wellsFargoServicer, boaServicer]);

  // Add GSE
  const fannieMae = factory.newResource(namespace, 'GSE', 'FannieMae');
  fannieMae.lenderMarkingId = 'FannieMaeMarketingID';
  
  const gseRegistry = await getParticipantRegistry(namespace + '.GSE');
  await gseRegistry.addAll([fannieMae]);    
}

/* Delete initial participants for ease of testing.
* @param {org.fanniemae.loan.DeleteInitialParticipant} deleteInitialParticipant
* @transaction
*/
async function deleteInitialParticipant(deleteInitialParticipant) {
   const namespace = 'org.fanniemae.loan';
   //Remove all Servicers
   const servicerRegistry = await getParticipantRegistry(namespace + '.Servicer');
   const servicers = await servicerRegistry.getAll();
   servicers.forEach(function(servicer) {
     servicerRegistry.remove(servicer);
   });
   //Remove all GSEs
   const gseRegistry = await getParticipantRegistry(namespace + '.GSE');
   const gses = await gseRegistry.getAll();
   gses.forEach(function(gse) {
     gseRegistry.remove(gse);
   });
}

/* Insert initial Loans for ease of testing.
* @param {org.fanniemae.loan.InsertInitialBulkLoans} insertInitialBulkLoans
* @transaction
*/
async function insertInitialBulkLoans(insertInitialBulkLoans) {
  const factory = new getFactory();
  const namespace = 'org.fanniemae.loan';

  // Add Loans
  const jloan = factory.newResource(namespace, 'Loan', 'jpm01');
  jloan.onBoardingStatus = 'PROPOSED';
  jloan.propertyAddress = '1111 Chambray Dr, Dallas, TX - 72341';
  jloan.propertyValue = 123456;
  jloan.originalLoanAmount = 100000;
  jloan.unPaidBalance = 100000;
  jloan.loanRate = 3.5;
  jloan.servicer = factory.newRelationship(namespace,'Servicer','Chase');
  
  const jloan2 = factory.newResource(namespace, 'Loan', 'jpm02');
  jloan2.onBoardingStatus = 'PROPOSED';
  jloan2.propertyAddress = '2222 Capital Ave, Dallas, TX - 72341';
  jloan2.propertyValue = 234567;
  jloan2.originalLoanAmount = 200000;
  jloan2.unPaidBalance = 200000;
  jloan2.loanRate = 3.6;
  jloan2.servicer = factory.newRelationship(namespace,'Servicer','Chase');
  
  const wloan1 = factory.newResource(namespace, 'Loan', 'wells01');
  wloan1.onBoardingStatus = 'PROPOSED';
  wloan1.propertyAddress = '1111 Washington St, Paris, TX - 72341';
  wloan1.propertyValue = 175000;
  wloan1.originalLoanAmount = 150000;
  wloan1.unPaidBalance = 150000;
  wloan1.loanRate = 2.2;
  wloan1.servicer = factory.newRelationship(namespace,'Servicer','WellsFargo');
  
  const wloan2 = factory.newResource(namespace, 'Loan', 'wells02');
  wloan2.onBoardingStatus = 'PROPOSED';
  wloan2.propertyAddress = '2222 Festive St, Dallas, TX - 72341';
  wloan2.propertyValue = 275000;
  wloan2.originalLoanAmount = 250000;
  wloan2.unPaidBalance = 250000;
  wloan2.loanRate = 4.2;
  wloan2.servicer = factory.newRelationship(namespace,'Servicer','WellsFargo');
  
  const boa1 = factory.newResource(namespace, 'Loan', 'boa01');
  boa1.onBoardingStatus = 'PROPOSED';
  boa1.propertyAddress = '1111 Beach St, Dallas, TX - 72341';
  boa1.propertyValue = 195000;
  boa1.originalLoanAmount = 190000;
  boa1.unPaidBalance = 190000;
  boa1.loanRate = 4.8;
  boa1.servicer = factory.newRelationship(namespace,'Servicer','BoA');
  
  const boa2 = factory.newResource(namespace, 'Loan', 'boa02');
  boa2.onBoardingStatus = 'PROPOSED';
  boa2.propertyAddress = '2222 Bassett Ave, Dallas, TX - 72341';
  boa2.propertyValue = 295000;
  boa2.originalLoanAmount = 245000;
  boa2.unPaidBalance = 245000;
  boa2.loanRate = 3.2;
  boa2.servicer = factory.newRelationship(namespace,'Servicer','BoA');
 
  const loanRegistry = await getAssetRegistry(namespace + '.Loan');
  await loanRegistry.addAll([jloan, jloan2, wloan1, wloan2, boa1, boa2]);
}

/* Delete all loans for ease of testing
* @param {org.fanniemae.loan.DeleteInitialBulkLoans} deleteInitialBulkLoans
* @transaction
*/
 async function DeleteInitialBulkLoans(DeleteInitialBulkLoans) {
   const namespace = 'org.fanniemae.loan';
   //Remove All Loans
   const loanRegistry = await getAssetRegistry(namespace + '.Loan');
   const loans = await loanRegistry.getAll();
   loans.forEach(function(loan) {
     loanRegistry.remove(loan);
   });
 }
