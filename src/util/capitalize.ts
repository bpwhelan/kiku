export function capitalize(str: string) {
  // returns the first letter capitalized + the string from index 1 and out aka. the rest of the string
  return str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
}
