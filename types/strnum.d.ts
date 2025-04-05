declare module "strnum" {
  type ConsiderOptions = {
    hex?: boolean; // Whether to allow hexadecimal numbers
    // oct?: boolean; // Uncomment if necessary to allow octal numbers
    leadingZeros?: boolean; // Whether to permit leading zeros in the number
    decimalPoint?: string; // Character to recognize as a decimal point
    eNotation?: boolean; // Whether to allow scientific notation (e.g., 1e3)
    skipLike?: RegExp; // A regular expression used to skip specific string patterns
  };

  export default function toNumber<T>(
    str: T,
    options?: ConsiderOptions,
  ): T extends string ? string | number : T;
}
