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

You also can perform actions such as adding or revoking delegates or attributes.

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

##### Adding did to the Ethr Registry
Requires account to have funds

```ts
// Create a ethr did object
const didEthr = createDidEthrFromPrivateKeyAndRpc(privateKey, rpcUrl, {chainNameOrId: chainId, registry: contract_address})

const recipeHash = await didEthr.selfRegister()
```

## Manage delegates

### Adding a delegate
Requires account to have funds

```ts
// ...
// Create a ethr did object
const didEthr = createDidEthrFromPrivateKeyAndRpc(privateKey, rpcUrl, {chainNameOrId: chainId, registry: contract_address})
// ...

const recipeHash = await ethrDid.addDelegate(delegateAddress); // ethr address account
```

### Validate that the delegate was added

Utilizando el resolver puede obtener el estado actual del did. Dentro del documento, en el attributo `didDocument.verificationMethod` encontrará el address de la cuenta que ha sido añadida como delegada

```ts
import { getResolver, Resolver } from '@kaytrust/did-ethr';

const rpcUrl = "https://polygon-amoy.drpc.org"; // A 
const chainId = 80002; // Amoy (Polygon)
const contract_address = "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8"; // EthereumDIDRegistry on Amoy (Polygon)
const didResolver = new Resolver(getResolver({chainId: chainId, rpcUrl: rpcUrl, registry: contract_address}))

// Returns a object with info about did
const doc = await didResolver.resolve(ethrDid.did)

// prints a formatted doc
console.log(JSON.stringify(doc, null, 2))
```
Similar to this.
```json
{
  "didDocumentMetadata": {
    "versionId": "11643688",
    "updated": "2024-09-06T16:03:15Z"
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  },
  "didDocument": {
    "id": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563",
    "verificationMethod": [
      {
        "id": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#controller",
        "type": "EcdsaSecp256k1RecoveryMethod2020",
        "controller": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563",
        "blockchainAccountId": "eip155:80002:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563"
      },
      {
        "id": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#delegate-2",
        "type": "EcdsaSecp256k1RecoveryMethod2020",
        "controller": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563",
        "blockchainAccountId": "eip155:80002:0xf63b16c77678D4D2F29aB24E3Bc01ef856391f7B"
      }
    ],
    "authentication": [
      "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#controller",
      "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#delegate-2"
    ],
    "assertionMethod": [
      "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#controller",
      "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#delegate-2"
    ],
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/secp256k1recovery-2020/v2",
      "https://w3id.org/security/v3-unstable"
    ]
  }
}
```

### Revoking a delegate

```ts
const recipeHash = await ethrDid.revokeDelegate(delegateAddress); // ethr address account
```