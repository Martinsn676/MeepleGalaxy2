export function compareByValue(a,b){
      // Convert the values to numbers for comparison
  const valueA = Number(a[1][0]);
  const valueB = Number(b[1][0]);
  // Compare the numeric values
  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }
  // If values are equal, no change in order
  return 0;
}