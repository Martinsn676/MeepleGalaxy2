/**
 * Get the param from Url or return false
 * @param {string} findElement string text to look for in Url
 * @returns return param or False
 */
export function getUrlParam(findElement) {
  let params = new URLSearchParams(window.location.search);
  let param = params.get(findElement);
  return param ? param : false;
}


export function removeCommonPrefix(str1, str2) {
    let commonPrefix = '';
    // Find the common prefix
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) {
            commonPrefix += str1[i];
        } else {
            break;
        }
    }
    // Remove the common prefix from both strings
    const resultStr1 = str1.slice(commonPrefix.length);
    return resultStr1;
}

// Example usage: