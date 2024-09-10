import { EthrDID, getResolver, Resolver } from '#src/index';
import { Wallet } from 'ethers';
import { createDidEthrFromPrivateKeyAndRpc } from '#src/index'
import { RPC_AMOY_DEFAULT, CONTRACT_REGISTRY_AMOY_DEFAULT, AMOY_CHAIN_ID } from '#src/constants';

const TEST_PRIVATE_KEY_1 = process.env.TEST_KEY_1;
const TEST_PRIVATE_KEY_2 = process.env.TEST_KEY_2;

let ethrDid: EthrDID;
let didResolver:Resolver

let wallet1: Wallet, wallet2: Wallet;
let owner: string = '', delegateAddress = '';
let is_owner_changed = false;

describe("delegates on Amoy", () => {
    beforeAll(()=>{
        wallet1 = new Wallet(TEST_PRIVATE_KEY_1 ?? Wallet.createRandom().privateKey)
        wallet2 = new Wallet(TEST_PRIVATE_KEY_2 ?? Wallet.createRandom().privateKey)
        ethrDid = createDidEthrFromPrivateKeyAndRpc(wallet1.privateKey, RPC_AMOY_DEFAULT, {chainNameOrId: AMOY_CHAIN_ID, registry: CONTRACT_REGISTRY_AMOY_DEFAULT})
        didResolver = new Resolver(getResolver({chainId: AMOY_CHAIN_ID, rpcUrl: RPC_AMOY_DEFAULT, registry: CONTRACT_REGISTRY_AMOY_DEFAULT}))
        delegateAddress = wallet2.address;
    })
    if (TEST_PRIVATE_KEY_1) {
        test('get owner', async () => {
            owner = await ethrDid.lookupOwner();
            is_owner_changed = owner.toLowerCase() === wallet2.address.toLowerCase()
            if (is_owner_changed) ethrDid = createDidEthrFromPrivateKeyAndRpc(wallet2.privateKey, RPC_AMOY_DEFAULT, {chainNameOrId: AMOY_CHAIN_ID, registry: CONTRACT_REGISTRY_AMOY_DEFAULT})
            expect(!!owner).toBe(true);
        });
        test('add delegate', async () => {
            const recipeHash = await ethrDid.addDelegate(delegateAddress);
            expect(!!recipeHash).toBe(true);
        }, 25000);
        test('validate added', async () => {
            const doc = await didResolver.resolve(ethrDid.did)
            const has_delegate = !!doc.didDocument?.verificationMethod?.some((v)=>{
                return v.blockchainAccountId === `eip155:${AMOY_CHAIN_ID}:${delegateAddress}`
            })
            expect(has_delegate).toBe(true);
        }, 25000);
        test('revoke delegate', async () => {
            const recipeHash = await ethrDid.revokeDelegate(delegateAddress);
            expect(!!recipeHash).toBe(true);
        }, 25000);
        test('validate revoked', async () => {
            const doc = await didResolver.resolve(ethrDid.did)
            const has_delegate = !!doc.didDocument?.verificationMethod?.some((v)=>{
                return v.blockchainAccountId === `eip155:${AMOY_CHAIN_ID}:${delegateAddress}`
            })
            expect(has_delegate).toBe(false);
        }, 25000);
    } else {
        test('delegate omitted because `TEST_KEY_1` env var is required', async () => {
            expect(true).toBe(true);
        });
    }
})