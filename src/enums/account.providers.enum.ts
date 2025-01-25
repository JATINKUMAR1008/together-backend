export const ProviderEnum = {
  GOOGLE: "GOOGLE",
  FACEBOOK: "FACEBOOK",
  TWITTER: "TWITTER",
  GITHUB: "GITHUB",
  EMAIL: "EMAIL",
};

export type ProviderEnumType = keyof typeof ProviderEnum;
