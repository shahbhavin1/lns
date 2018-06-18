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
  loan.onBoardingStatus = 'ACCPTED';
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
  if (loan.payments)
    loan.payments.push(recordPayment);
  else
      loan.payments = [recordPayment];
  const loanRegistry = await getAssetRegistry('org.fanniemae.loan.Loan');
  await loanRegistry.update(loan);
}

/*
* @param {org.fanniemae.loan.InitialSetup} initialSetup
* @transaction
*/

async function initialSetup(initialSetup) {
  const factory = new getFactory();
  const namespace = 'org.fanniemae.loan';

  // Add servicers
  const chaseServicer = factory.newResource(namespace, 'Servicer', 'Chase');
  chaseServicer.lenderMarkingId = 'ChaseMarketingID';

  const wellsFargoServicer = factory.newResource(namespace, 'Servicer', 'WellsFargo');
  wellsFargoServicer.lenderMarkingId = 'WellsFargoMarketingID';

  const servicerRegistry = await getParticipantRegistry(namespace + '.Servicer');
  await servicerRegistry.addAll([chaseServicer, wellsFargoServicer]);

  // Add GSE
  const fannieMae = factory.newResource(namespace, 'GSE', 'FannieMae');
  fannieMae.lenderMarkingId = 'FannieMaeMarketingID';
  
  const gseRegistry = await getParticipantRegistry(namespace + '.GSE');
  await gseRegistry.addAll([fannieMae]);

  // Add Loan
  const loan = factory.newResource(namespace, 'Loan', 'LOAN01');
  loan.onBoardingStatus = 'PROPOSED';
  loan.propertyAddress = '1234 ABCD Dr, Dallas, TX - 72341';
  loan.propertyValue = 123456;
  loan.originalLoanAmount = 100000;
  loan.unPaidBalance = 100000;
  loan.loanRate = 3.8;
  loan.servicer = factory.newRelationship(namespace,'Servicer','Chase');
  
  const loan2 = factory.newResource(namespace, 'Loan', 'LOAN02');
  loan2.onBoardingStatus = 'PROPOSED';
  loan2.propertyAddress = '1234 EFGJ Dr, Dallas, TX - 72341';
  loan2.propertyValue = 789876;
  loan2.originalLoanAmount = 600000;
  loan2.unPaidBalance = 600000;
  loan2.loanRate = 4.2;
  loan2.servicer = factory.newRelationship(namespace,'Servicer','WellsFargo');
 
  const loanRegistry = await getAssetRegistry(namespace + '.Loan');
  await loanRegistry.addAll([loan, loan2]);
}

/*
* @param {org.fanniemae.loan.TearDownAll} tearDownAll
* @transaction
*/

 async function tearDownAll(tearDownAll) {
   const namespace = 'org.fanniemae.loan';
   //Remove All Loans
   const loanRegistry = await getAssetRegistry(namespace + '.Loan');
   const loans = await loanRegistry.getAll();
   loans.forEach(function(loan) {
     loanRegistry.remove(loan);
   });
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