import { faker } from '@faker-js/faker';

// generate data
faker.seed(0);
export const data = [...new Array(100)].map(() => ({
  id: faker.datatype.uuid(),
  project: faker.finance.accountName(),
  description: faker.finance.transactionDescription()
}));