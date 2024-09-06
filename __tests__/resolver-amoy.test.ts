import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { DIDResolver } from 'did-resolver'
import { Wallet } from 'ethers'
import { AMOY_CHAIN_ID, CONTRACT_REGISTRY_AMOY_DEFAULT, RPC_AMOY_DEFAULT } from '#src/constants'

let providerConfig: Parameters<typeof getResolver>[0]

let ethrDidResolver:Record<string, DIDResolver>
let didResolver:Resolver

let address = "0xa2E494974d53FD6d2bd6Fd27cb5d87b3E6E90ACe";

const TEST_PRIVATE_KEY_1 = process.env.TEST_KEY_1;

describe("ethr did resolver Amoy", () => {
    beforeAll(()=>{
        providerConfig = {
            chainId: AMOY_CHAIN_ID, rpcUrl: RPC_AMOY_DEFAULT, registry: CONTRACT_REGISTRY_AMOY_DEFAULT,
        }
        ethrDidResolver = getResolver(providerConfig)
        didResolver = new Resolver(ethrDidResolver)
        if (TEST_PRIVATE_KEY_1) address = new Wallet(TEST_PRIVATE_KEY_1).address;
    })
    test('resolve did', async () => {
        const doc = await didResolver.resolve(`did:ethr:0x13882:${address}`)
        console.log("doc", JSON.stringify(doc, null, 2))
        expect(!!doc).toBe(true);
    }, 15000);
})