export const PRODUCT_SIZES = ["1", "2", "3"] as const;
export type ProductSize = typeof PRODUCT_SIZES[number];

export const SIZE_DETAILS = {
  "1": { shoulder: "42cm", chest: "96cm", arm: "61cm", length: "65cm" },
  "2": { shoulder: "44cm", chest: "100cm", arm: "62cm", length: "67cm" },
  "3": { shoulder: "46cm", chest: "104cm", arm: "63cm", length: "69cm" },
} as const;
