import * as Promise from 'bluebird'
import { hashValidator, validate } from '@iota/validators'
import { bundleValidator } from '@iota/bundle-validator'
import { createTraverseBundle } from './'
import { Bundle, Callback, Provider, Hash, Transaction } from '../../types'

export const validateBundle = (bundle: Bundle) => validate(bundleValidator(bundle))

/**  
 * @method createGetBundle 
 *
 * @param {Provider} provider - Network provider for accessing IRI
 *
 * @return {function} {@link getBundle}
 */
export const createGetBundle = (provider: Provider) => {
    const traverseBundle = createTraverseBundle(provider)

    /**
     * Fetches and validates the bundle given a _tail_ transaction hash, by calling `{@link traverseBundle}`
     * and traversing through `trunkTransaction`.
     *
     * @example
     * ```js
     * getBundle(tail)
     *    .then(bundle => {
     *        // ...
     *    })
     *    .catch(err => {
     *        // handle errors
     *    })
     * ```
     *
     * @method getBundle
     * 
     * @param {Hash} tailTransactionHash - Tail transaction hash
     * 
     * @returns {Promise}
     * @fulfil {Transaction[]} Bundle as array of transaction objects
     * @reject {Error}
     * - `INVALID_HASH`
     * - `INVALID_TAIL_HASH`: Provided transaction is not tail (`currentIndex !== 0`) 
     * - `INVALID_BUNDLE`: Bundle is syntactically invalid
     * - Fetch error
     */
    return function getBundle(tailTransactionHash: Hash, callback?: Callback<Bundle>): Promise<Bundle> {
        return Promise.resolve(validate(hashValidator(tailTransactionHash)))
            .then(() => traverseBundle(tailTransactionHash))
            .tap(validateBundle)
            .asCallback(callback)
    }
}
