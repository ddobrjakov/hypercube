/* 
	### Properties
	multiply(a, divideL(c, a)) = c
	multiply(divideR(c, b), b) = c
	divideL(multiply(a, b), a) = b
	divideR(multiply(a, b), b) = a
*/

/** 
 * Map every **index in arr1** to **element of arr2** which has its index equal to the arr1 element.
 * * `arr1:[A:B], arr2:[B:C] => (arr1*arr2):[A:C]`
 * @param {[A:B]} arr1 First array.
 * @param {[B:C]]} arr2 Second array.
 * @returns {[A:C]]} Result of multiplication.
 */
export function multiply(arr1, arr2) {
	return arr1.map((item, _index) => arr2[item])
}

/**
 * Map every **index in arr1** to **index in arr2** with the same element.
 * * `arr1:[A:C], arr2:[B:C] => (arr1 /- arr2):[A:B]`
 * * `(arr1 /- arr2) * arr2 = arr1`
 * ```js
 * multiply(divideR(c, b), b) = c
 * divideR(multiply(a, b), b) = a
 * divideR(c, b) = c * invert(b)
 * ```
 * @param {[A:C]} arr1 Result of multiplication.
 * @param {[B:C]} arr2 Second/right factor of multiplication.
 * @returns {[A:B]} First/left factor of multiplication.
 */
export function divideR(arr1, arr2) {
	return multiply(arr1, invert(arr2))
}

/**
 * Map every **element of arr2** to **element of arr1** with the same index.
 * * `arr1:[A:C], arr2:[A:B] => (arr1 -/ arr2):[B:C]`
 * * `arr2 * (arr1 -/ arr2) = arr1`
 * ```js
 * multiply(a, divideL(c, a)) = c
 * divideL(multiply(a, b), a) = b
 * divideL(c, a) = invert(a) * c
 * ```
 * @param {[A:C]} arr1 Result of multiplication.
 * @param {[A:B]} arr2 First/left factor of multiplication.
 * @returns {[B:C]} Second/right factor of multiplication.
 */
export function divideL(arr1, arr2) {
	return multiply(invert(arr2), arr1)
	/* Alternatively:
		const res = Array(arr2.length)
		arr2.forEach((item, i) => res[item] = arr1[i])
		return res
	*/
}

/**
 * Map every **element of arr** to **index in arr** with this element.
 * @param {[A:B]} arr Array to invert.
 * @returns {[B:A]} Inverted array.
 */
export function invert(arr) {
	const res = Array(arr.length)
	arr.forEach((e, i) => res[e] = i)
	return res
}
