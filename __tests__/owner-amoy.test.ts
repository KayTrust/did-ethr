import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';
import { createDidEthrFromPrivateKeyAndRpc } from '#src/create'
import { RPC_AMOY_DEFAULT, CONTRACT_REGISTRY_AMOY_DEFAULT, AMOY_CHAIN_ID } from '#src/constants';

const TEST_PRIVATE_KEY_1 = process.env.TEST_KEY_1;
const TEST_PRIVATE_KEY_2 = process.env.TEST_KEY_2;

let ethrDid: EthrDID;

let wallet1: Wallet, wallet2: Wallet;
let owner: string = '';
let is_owner_changed = false;

// const WITH_CHANGE_OWNER = parseBoolean(process.env.TEST_WITH_CHANGE_OWNER);
// const WITH_RECOVER_OWNER = parseBoolean(process.env.TEST_WITH_RECOVER_OWNER);

const OWNER_ACTIONS = ['recover', 'change', 'self-register'] as const
type OWNER_ACTION_TYPE = typeof OWNER_ACTIONS[number]

const OWNER_ACTION = process.env.TEST_WITH_OWNER_ACTION;
const with_owner_action = (OWNER_ACTION ? OWNER_ACTIONS.includes(OWNER_ACTION) : false) && !!TEST_PRIVATE_KEY_1

describe("did ethr controller Amoy", () => {
    beforeAll(()=>{
        wallet1 = new Wallet(TEST_PRIVATE_KEY_1 ?? Wallet.createRandom().privateKey)
        wallet2 = new Wallet(TEST_PRIVATE_KEY_2 ?? Wallet.createRandom().privateKey)
        ethrDid = createDidEthrFromPrivateKeyAndRpc(wallet1.privateKey, RPC_AMOY_DEFAULT, {chainNameOrId: AMOY_CHAIN_ID, registry: CONTRACT_REGISTRY_AMOY_DEFAULT})
    })
    test('same address', () => {
        expect(ethrDid.address).toBe(wallet1.address);
    });
    test('get owner', async () => {
        owner = await ethrDid.lookupOwner();
        is_owner_changed = owner.toLowerCase() === wallet2.address.toLowerCase()
        expect(!!owner).toBe(true);
    });
    test('eval owner', async () => {
        expect(owner).toBe(is_owner_changed ? wallet2.address : wallet1.address);
    });
    if (with_owner_action) {
        test('owner action: ' + OWNER_ACTION, async () => {
            let run_action = true;
            let ethrDidLocal: EthrDID = ethrDid;
            let newOwner: string = '';

            switch (OWNER_ACTION) {
                case "change":
                    run_action = !is_owner_changed
                    ethrDidLocal = ethrDid;
                    newOwner = wallet2.address
                    break;
                case "recover":
                    run_action = is_owner_changed
                    ethrDidLocal = createDidEthrFromPrivateKeyAndRpc(wallet2.privateKey, RPC_AMOY_DEFAULT, {chainNameOrId: AMOY_CHAIN_ID, registry: CONTRACT_REGISTRY_AMOY_DEFAULT, identifier: wallet1.address})
                    newOwner = wallet1.address;
                    if (!TEST_PRIVATE_KEY_2) throw new Error(" to recover owner from did:ethr is required a TEST_KEY_2 env variable");
                    
                    break;
                case "self-register":
                    run_action = true;
                    ethrDidLocal = ethrDid;
                    newOwner = wallet1.address;
                    break;
                default:
                    run_action = false;
                    break;
            }

            if (!run_action) {
                expect(true).toBe(true);
            } else {
                const time_int = 5;
                let count = -time_int;
                const showTransfering = () => {
                    count += time_int;
                    console.log("transfering...", count ? count : "")
                }
                showTransfering()
                const interval = setInterval(showTransfering, time_int * 1000)
                let recipeHash = ''
                try {
                    recipeHash = await ethrDidLocal.changeOwner(newOwner);
                } catch (error) {
                    clearInterval(interval);
                    throw error;
                }
                clearInterval(interval);
                console.log("recipeHash", recipeHash);
                expect(!!recipeHash).toBe(true);
            }
        }, 15000);
    }
})