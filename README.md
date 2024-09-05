# KayDev - did-ethr

## Contract deployed (EthereumDIDRegistry)
### Cardona zkEVM Testnet 
`0x03d5003bf0e79c5f5223588f347eba39afbc3818` This is the official contract deployed in Cardona.

### Polygon Amoy (Tesnet)
`0xBC56d0883ef228b2B16420E9002Ece0A46c893F8` This is the address of the contract self-deployed on Polygon Amoy.

## How to create a ethr did?

### Example on Amoy (Polygon Testnet)

### Basic Creation of an ethr DID
A basic creation only requires the account address or the public key (both associated with a private key under your control).

With a basic creation, you cannot explicitly register that you are the owner of that DID, as the creation is only local and does not connect to any network. However, it is not necessary to explicitly register that you are the owner of that DID, since by possessing the private key, it is implicitly known that an address or derived public key belongs to the holder of that private key.

You also cannot perform actions such as adding or revoking delegates or attributes.

```ts
import { createDidEthr } from '@kaytrust/did-ethr'

const addressOrPublicKey = "<YOUR_ADDRESS_OR_PUBLIC_KEY>";
// Amoy (Polygon)
const chainId = 80002; // Optional parameter, defaults ethereum mainnet

// Create a ethr did object
const didEthr = createDidEthr(addressOrPublicKey, {chainNameOrId: chainId})

// prints did
console.log(didEthr.did) // "did:ethr:0x13882:<address_or_public_key>"
```

#### Complete Creation of an ethr DID

Using the `createDidEthrFromPrivateKeyAndRpc` function. It has 2 required parameters: a `rpcUrl` (json rpc) and a `privateKey`.

A complete creation allows actions within the contract, such as explicitly registering ownership of the ethr DID in the contract (optional, since by possessing the private key you are implicitly the owner of the DID). The main purpose of registering ownership in the contract is to transfer ownership of a DID associated with an address `A` (`did:ethr:A`) to another owner (address `B`). In other words, upon transfer, account `B` becomes the owner of a DID with address `A` (`did:ethr:A`). The DID is preserved even though the owner has a different address.

```ts
import { createDidEthrFromPrivateKeyAndRpc } from '@kaytrust/did-ethr'

const privateKey = "<YOUR_PRIVATE_KEY>";
const rpcUrl = "https://polygon-amoy.drpc.org"; // A 
const chainId = 80002; // Amoy (Polygon)
const contract_address = "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8"; // EthereumDIDRegistry on Amoy (Polygon)

// Create a ethr did object
const didEthr = createDidEthrFromPrivateKeyAndRpc(privateKey, rpcUrl, {chainNameOrId: chainId, registry: contract_address})

// prints did
console.log(didEthr.did) // "did:ethr:0x13882:<address>"
```