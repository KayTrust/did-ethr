# KayDev - did-ethr

## Contract deployed (EthereumDIDRegistry)
### Cardona zkEVM Testnet 
`0x03d5003bf0e79c5f5223588f347eba39afbc3818` This is the official contract deployed in Cardona.

### Polygon Amoy (Tesnet)
`0xBC56d0883ef228b2B16420E9002Ece0A46c893F8` This is the address of the contract self-deployed on Polygon Amoy.

## How to create a ethr did?

### Example on Amoy (Polygon Testnet)

Using the `createDidEthrFromPrivateKeyAndRpc` function. It has 2 required params: a `rpcUrl` (json rpc) and a `privateKey`

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