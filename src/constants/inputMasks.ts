export const cpfMask = [
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];
export const cnpjMask = [
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];
export const cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
export const birthDateMask = [
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const openingMask = [
  /\d/, // 0
  /\d/, // 8
  ":", // :
  /\d/, // 0
  /\d/, // 0
  " ", // espaço
  "-", // -
  " ", // espaço
  /\d/, // 1
  /\d/, // 8
  ":", // :
  /\d/, // 0
  /\d/, // 0
  ",", // ,
  " ", // espaço
  "d", // d
  "e", // e
  " ", // espaço
  /[a-zA-Z]/, // S
  /[a-zA-Z]/, // e
  /[a-zA-Z]/, // g
  " ", // espaço
  "à", // à
  " ", // espaço
  /[a-zA-Z]/, // S
  /[a-zA-Z]/, // á
  /[a-zA-Z]/, // b
];
