export const numberWithCommas = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const numberWithCommaAndDecimal = (value: number, decimalPlaces: number): string =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
