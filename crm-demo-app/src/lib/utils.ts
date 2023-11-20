import { AccountStatus, Currencies, Sources } from "./types/account";
import { faker } from "@faker-js/faker";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
//@ts-ignore
import ColorThief from "colorthief";
import * as z from "zod";

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

export const generateFakeAccount = () => {
  return {
    name: faker.company.name(),
    city: faker.location.city(),
    country: faker.location.countryCode(),
    is_active: Boolean(faker.number.int({ min: 0, max: 1 })),
    revenue: faker.number.float({ min: 0, max: 1000000, precision: 0.01 }),
    website: faker.internet.url(),
    address_line: faker.location.streetAddress({ useFullAddress: true }),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    status: getRandomValueFromSimpleObject(AccountStatus),
    currency: getRandomValueFromArray(Currencies)!,
    source: getRandomValueFromArray(Sources)!,
  };
};

export const getDefaultAccount = () => ({
  city: "",
  country: "",
  currency: "",
  name: "",
  source: "",
  status: "",
  address_line: "",
  is_active: false,
  revenue: 0,
  state: "",
  website: "",
  zip: "",
});

export const getAvatar = () => {
  return createAvatar(botttsNeutral, {
    seed: faker.company.buzzVerb(),
  }).toDataUriSync();
};

export const getImageBackgroundColor = (image: HTMLImageElement) => {
  const colorThief = new ColorThief();
  try {
    const rgbColor = colorThief.getColor(image) as number[];
    return rgbColor.join(",");
  } catch (error: any) {
    return "255,255,255";
  }
};

export const getCurrentTimestampWithTimezone = () => {
  return new Date(Date.now()).toISOString();
};

export const getDefaultFromSchema = <Schema extends z.AnyZodObject>(
  schema: Schema
) => {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()];
      }

      return [key, undefined];
    })
  );
};
