import {
  AccountStatus,
  Currencies,
  Sources,
  TAccountZOD,
} from "./types/account";
import { faker } from "@faker-js/faker";

function getRandomValueFromSimpleObject<T extends object>(simpleObject: T) {
  const simpleObjectKeys = Object.keys(simpleObject);

  const randomNumber = faker.number.int({
    min: 0,
    max: simpleObjectKeys.length - 1,
  });

  const randomProp = simpleObjectKeys[
    randomNumber
  ] as keyof typeof simpleObject;

  return simpleObject[randomProp];
}

function getRandomValueFromArray<T>(arr: readonly T[] | T[]) {
  if (!arr.length) {
    return undefined;
  }

  return arr[faker.number.int({ min: 0, max: arr.length - 1 })];
}

export const generateFakeAccount = (): TAccountZOD => {
  return {
    accountName: faker.company.name(),
    city: faker.location.city(),
    country: faker.location.country(),
    isActive: Boolean(faker.number.int({ min: 0, max: 1 })),
    revenue: faker.number.float({ min: 0, max: 1000000, precision: 0.01 }),
    website: faker.internet.url(),
    addressLine: faker.location.streetAddress({ useFullAddress: true }),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    status: getRandomValueFromSimpleObject(AccountStatus),
    currency: getRandomValueFromArray(Currencies)!,
    source: getRandomValueFromArray(Sources)!,
  };
};
