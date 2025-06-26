import { createRandomPrivateKey, EthrDID } from '#src/index';
import { createDidEthr } from '#src/index'
import { AMOY_CHAIN_ID, CARDONA_CHAIN_ID } from '#src/constants';

let address = '', publicKey = '';

describe("create a did ethr", () => {
    beforeAll(()=>{
        const { address: address0, publicKey: publicKey0, privateKey } = EthrDID.createKeyPair()
        address = address0;
        publicKey = publicKey0;
    })
    test('create a random private key', () => {
        const privateKey = createRandomPrivateKey()
        console.log("private.key", privateKey)
        expect(privateKey).not.toBeNull();
    });
    test('create a did on mainnet', () => {
        const didEthr = createDidEthr(address)
        expect(didEthr.did).toBe(`did:ethr:${address}`);
    });

    test('create a did on Polygon Amoy', () => {
        const didEthr = createDidEthr(address, {chainNameOrId: AMOY_CHAIN_ID, registry: "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8"})
        expect(didEthr.did).toBe(`did:ethr:0x13882:${address}`);
    });

    test('create a did on Cardona', () => {
        const didEthr = createDidEthr(address, {chainNameOrId: CARDONA_CHAIN_ID, registry: "0x03d5003bf0e79c5f5223588f347eba39afbc3818"})
        expect(didEthr.did).toBe(`did:ethr:0x98a:${address}`);
    });

    test('create a did with a public key on mainnet', () => {
        const didEthr = createDidEthr(publicKey)
        console.log('did:', didEthr.did)
        expect(didEthr.did).toBe(`did:ethr:${publicKey}`);
    });
})