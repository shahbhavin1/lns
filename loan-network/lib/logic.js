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

async function initialDemo(initialDemo) {
  const factory = new getFactory();
  const namespace = 'org.fanniemae.loan';

  // Add servicers
  const chaseServicer = factory.newResource(namespace, 'Servicer', 'Chase');
  chaseServicer.lenderMarkingId = 'ChaseMarketingID';

  const wellsFargoServicer = factory.newResource(namespace, 'Servicer', 'WellsFargo');
  wellsFargoServicer.lenderMarkingId = 'WellsFargoMarketingID';

  const servicerRegistry = facotry.getParticipantRegistry(namespace + '.Servicer');
  servicerRegistry.addAll([chaseServicer, wellsFargoServicer]);

  // Add GSE
  const fannieMae = factory.getResource(namespace, 'GSE', 'FannieMae');
  fannieMae.lenderMarkingId = 'FannieMaeMarketingID';
  
  const gseRegistry = factory.getParticipantRegistry(namespace + '.GSE');
  gseRegistry.addAll([gseRegistry]);

  // Add Loan
  const loan = factory.newResource(namespace, 'Loan', 'LOAN01');
  loan.onBoardingStatus = 'PROPOSED';
  loan.propertyAddress = '1234 ABCD Dr, Dallas, TX - 72341';
  loan.propertyValue = 123456;
  loan.originalLoanAmount = 100000;
  loan.unPaidBalance = 100000;
  loan.loanRate = 0.2;
  loan.servicer = factory.newRelationShip(namespace,'Servicer','Chase');
 
  const loanRegistry = factory.getParticipantRegistry(namespace + '.Loan');
  loanRegistry.addAll([loan]);
}