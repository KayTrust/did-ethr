# KayDev - did-ethr

## Contract deployed (EthereumDIDRegistry)
### Cardona zkEVM Testnet 
`0x03d5003bf0e79c5f5223588f347eba39afbc3818` This is the official contract deployed in Cardona.

### Polygon Amoy (Tesnet)
`0xBC56d0883ef228b2B16420E9002Ece0A46c893F8` This is the address of the contract self-deployed on Polygon Amoy.

## How to create a ethr did?

### Example on Amoy (Polygon Testnet)

#### Creación básica de un did ethr
Una creación básica no necesita nada más que el address de cuenta o la llave pública (ambas asociadas una llave privada bajo tu control).

Con una creación básica no se puede registrar explicitamente que eres el owner de ese did, ya que la creación solo es en local y no se conecta a ninguna red, sin embargo, no es necesario registrar explicitamente que eres propietario de ese did, ya que al poseer la llave privada implicitamente todos saben que una address o llave pública derrivada pertenece al poseedor de dicha llave privada.

Tampoco puedes hacer acciones como añadir delegados o attributos, ni revocarlos.

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

#### Creación completa de un did ethr

Using the `createDidEthrFromPrivateKeyAndRpc` function. It has 2 required parameters: a `rpcUrl` (json rpc) and a `privateKey`

Una creación completa permite realizar acciones dentro del contrato, como hacer una registro explícito de propiedad del did ethr en el contrato (opcional, ya que implicitamente al poseer la llave privada eres propietario del did). El 

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