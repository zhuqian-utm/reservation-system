import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
// Look! Using the alias directly:
import { ReservationStatus } from '@reservation-system/data-access';

Then('the reservation status should be requested', function () {
  const status = this.lastResponse.data.status;
  
  // Using the shared Enum ensures your test stays in sync with the DB
  expect(status).to.equal(ReservationStatus.REQUESTED);
});