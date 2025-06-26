# **KayTrust - DID-ETHR**

The `@kaytrust/did-ethr` library is a tool designed to facilitate the creation, management, and resolution of Decentralized Identifiers (DIDs) based on Ethereum. This library abstracts the complexity of interacting with smart contracts like `EthereumDIDRegistry` and allows developers to work with DIDs in a simple and efficient manner.

This document is designed to be accessible to both beginners and experienced developers.

---

## **What is a DID?**

A Decentralized Identifier (DID) is a unique identifier that allows an entity (person, organization, or device) to have a verifiable identity in a decentralized system, such as a blockchain. DIDs do not depend on a central authority, making them ideal for self-sovereign identity applications.

In the case of `@kaytrust/did-ethr`, the DIDs are Ethereum-based and can interact with smart contracts to perform actions such as:
- Registering the ownership of a DID.
- Transferring the ownership of a DID.
- Adding or revoking delegates.
- Resolving a DID to obtain its associated document.

---

## **Installation**

To install the library, use one of the following commands:

With Yarn:
```bash
yarn add @kaytrust/did-ethr
```

With NPM:
```bash
npm install @kaytrust/did-ethr
```

---

## **Deployed Contracts**

### Cardona zkEVM Testnet
Contract address: `0x03d5003bf0e79c5f5223588f347eba39afbc3818`

### Polygon Amoy (Testnet)
Contract address: `0xBC56d0883ef228b2B16420E9002Ece0A46c893F8`

---

## **How to Create a DID**

### **0. Create a Random DID**

For testing or other purposes, you can create a new random DID (never repeated). By using the static function `EthrDID.createKeyPair()`, you obtain an object with the following information: `{ address, privateKey, publicKey, identifier }`. The **identifier** is the new DID in text format, and both the address and publicKey are derived from the private key (`privateKey`). Safeguard your private key if you wish to retain the DID.

### **1. Basic Creation of a DID**

The basic creation of a DID only requires an Ethereum address or a public key. This type of creation does not interact with the blockchain, so it does not register the DID in any smart contract.

#### **Code Example**
```ts
import { createDidEthr } from '@kaytrust/did-ethr';

// Ethereum address or public key associated with your account
const addressOrPublicKey = "<YOUR_ADDRESS_OR_PUBLIC_KEY>";

// Network ID (optional, defaults to Ethereum Mainnet)
const chainId = 80002; // Amoy (Polygon)

// Create an Ethereum-based DID object
const didEthr = createDidEthr(addressOrPublicKey, { chainNameOrId: chainId });

// Print the generated DID
console.log(didEthr.did); // Example: "did:ethr:0x13882:<address_or_public_key>"
```

#### **Result**
The generated DID will have the following format:
```
did:ethr:<chain_namespace>:<address_or_public_key>
```

---

### **2. Complete Creation of a DID**

This method of creation allows interaction with the blockchain, including registering the DID in a smart contract, adding delegates, or transferring the ownership of the DID. For this, you need the private key and an RPC URL.

#### **Code Example**
```ts
import { createDidEthrFromPrivateKeyAndRpc } from '@kaytrust/did-ethr';

// Private key of your account
const privateKey = "<YOUR_PRIVATE_KEY>";

// RPC node URL of the network
const rpcUrl = "https://polygon-amoy.drpc.org"; // Amoy (Polygon)

// Network ID and EthereumDIDRegistry contract address
const chainId = 80002; // Amoy (Polygon)
const contractAddress = "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8";

// Create an Ethereum-based DID object
const didEthr = createDidEthrFromPrivateKeyAndRpc(privateKey, rpcUrl, {
  chainNameOrId: chainId,
  registry: contractAddress,
});

// Print the generated DID
console.log(didEthr.did); // Example: "did:ethr:0x13882:<address>"
```

---

## **Register a DID in the EthereumDIDRegistry Contract**

Registering a DID in the contract allows it to be recognized on the blockchain. This requires funds in the account associated with the private key.

#### **Code Example**
```ts
// Register the DID in the contract
const recipeHash = await didEthr.selfRegister();

// Print the transaction hash
console.log(`Successful registration. Transaction hash: ${recipeHash}`);
```

---

## **Delegate Management**

Delegates are accounts authorized to act on behalf of a DID. You can add, validate, or revoke delegates using the methods provided by the library.

### **1. Add a Delegate**

#### **Code Example**
```ts
// Ethereum address of the delegate
const delegateAddress = "<DELEGATE_ETH_ADDRESS>";

// Add the delegate
const recipeHash = await didEthr.addDelegate(delegateAddress);

// Print the transaction hash
console.log(`Delegate added. Transaction hash: ${recipeHash}`);
```

---

### **2. Validate That the Delegate Was Added**

You can resolve the DID to verify if the delegate was added correctly.

#### **Code Example**
```ts
import { getResolver, Resolver } from '@kaytrust/did-ethr';

// Create a resolver for the Amoy (Polygon) network
const didResolver = new Resolver(
  getResolver({
    chainId: 80002,
    rpcUrl: "https://polygon-amoy.drpc.org",
    registry: "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8",
  })
);

// Resolve the DID
const doc = await didResolver.resolve(didEthr.did);

// Print the resolved document
console.log(JSON.stringify(doc, null, 2));
```

#### **Example of a Resolved Document**
```json
{
  "didDocument": {
    "id": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563",
    "verificationMethod": [
      {
        "id": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563#controller",
        "type": "EcdsaSecp256k1RecoveryMethod2020",
        "controller": "did:ethr:0x13882:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563",
        "blockchainAccountId": "eip155:80002:0x2763b3bdadeAE0c8E36f8C7d3A8d3B283f04A563"
      }
    ]
  }
}
```

---

### **3. Revoke a Delegate**

#### **Code Example**
```ts
// Ethereum address of the delegate to revoke
const delegateAddress = "<DELEGATE_ETH_ADDRESS>";

// Revoke the delegate
const recipeHash = await didEthr.revokeDelegate(delegateAddress);

// Print the transaction hash
console.log(`Delegate revoked. Transaction hash: ${recipeHash}`);
```

---

## **Use Cases**

1. **Self-Sovereign Identity**:
   - Allows users to control their identity without relying on a central authority.

2. **Decentralized Authentication**:
   - Useful for applications requiring blockchain-based authentication.

3. **Delegate Management**:
   - Ideal for organizations needing to delegate permissions to different accounts.

---

## **Conclusion**

The `@kaytrust/did-ethr` library simplifies interaction with Ethereum-based DIDs, providing a clear and well-documented API. With this guide, even developers new to the world of DIDs and Ethereum can start working with this technology effectively.

--- 

This version retains the strengths of the original README, providing clarity, detailed examples, and a modular structure suitable for both beginners and experienced developers.