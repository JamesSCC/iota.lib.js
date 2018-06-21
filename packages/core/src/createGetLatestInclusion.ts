import * as Promise from 'bluebird'
import { createGetInclusionStates, createGetNodeInfo } from './'
import { Callback, Hash, Provider } from '../../types'

/**  
 * @method createGetLatestInclusion 
 * 
 * @param {Provider} provider - Network provider for accessing IRI
 *
 * @return {function} {@link getLatestInclusion}
 */
export const createGetLatestInclusion = (provider: Provider) => {
    const getInclusionStates = createGetInclusionStates(provider)
    const getNodeInfo = createGetNodeInfo(provider)

    /**
     * Fetches inclusion states of given transactions and a list of tips,
     * by calling `{@link getInclusionStates}` on `latestSolidSubtangleMilestone`.
     *
     * @example
     * getLatestInclusion(hashes)
     *    .then(states => {
     *        // ...
     *    })
     *    .catch(err => {
     *        // handle error
     *    })
     *
     * @method getLatestInclusion
     *
     * @param {Array<Hash>} transactions - List of transactions hashes 
     * @param {number} tips - List of tips to check if transactions are referenced by
     * @param {Callback} [callback] - Optional callback
     *
     * @return {Promise}
     * @fulfil {boolean[]} List of inclusion states
     * @reject {Error}
     * - `INVALID_HASHES_ARRAY`: Invalid transaction hashes
     * - Fetch error
     */
    return function getLatestInclusion(
        transactions: ReadonlyArray<Hash>,
        callback?: Callback<ReadonlyArray<boolean>>
    ): Promise<ReadonlyArray<boolean>> {
        return getNodeInfo()
            .then(nodeInfo => getInclusionStates(transactions, [nodeInfo.latestSolidSubtangleMilestone]))
            .asCallback(callback)
    }
}
