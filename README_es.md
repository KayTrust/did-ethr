# **KayTrust - DID-ETHR**

La librería `@kaytrust/did-ethr` es una herramienta diseñada para facilitar la creación, gestión y resolución de Identificadores Descentralizados (DIDs) basados en Ethereum. Esta librería abstrae la complejidad de interactuar con contratos inteligentes como `EthereumDIDRegistry` y permite a los desarrolladores trabajar con DIDs de manera sencilla y eficiente.

Este documento está diseñado para ser accesible tanto para principiantes como para desarrolladores experimentados.

---

## **¿Qué es un DID?**

Un Identificador Descentralizado (DID) es un identificador único que permite a una entidad (persona, organización o dispositivo) tener una identidad verificable en un sistema descentralizado, como una blockchain. Los DIDs no dependen de una autoridad central, lo que los hace ideales para aplicaciones de identidad autosoberana.

En el caso de `@kaytrust/did-ethr`, los DIDs están basados en Ethereum y pueden interactuar con contratos inteligentes para realizar acciones como:
- Registrar la propiedad de un DID.
- Transferir la propiedad de un DID.
- Añadir o revocar delegados.
- Resolver un DID para obtener su documento asociado.

---

## **Instalación**

Para instalar la librería, utiliza uno de los siguientes comandos:

Con Yarn:
```bash
yarn add @kaytrust/did-ethr
```

Con NPM:
```bash
npm install @kaytrust/did-ethr
```

---

## **Contratos Desplegados**

### Cardona zkEVM Testnet
Dirección del contrato: `0x03d5003bf0e79c5f5223588f347eba39afbc3818`

### Polygon Amoy (Testnet)
Dirección del contrato: `0xBC56d0883ef228b2B16420E9002Ece0A46c893F8`

---

## **Cómo Crear un DID**

### **0. Crear un did aleatorio**

Para pruebas o otros propósitos, puedes crear un nuevo DID de forma aleatoria (nunca se repiten). Utilizando la función estática `EthrDID.createKeyPair()` obtienes un objeto con la siguente información: `{ address, privateKey, publicKey, identifier }`. El **identifier** es el nuevo DID en formato de texto, tanto el address como el publicKey deriban de la clave privada (`privateKey`). Resguarda tu clave privada si deseas conservar el DID

### **1. Creación Básica de un DID**

La creación básica de un DID solo requiere una dirección Ethereum o una clave pública. Este tipo de creación no interactúa con la blockchain, por lo que no registra el DID en ningún contrato inteligente.

#### **Ejemplo de Código**
```ts
import { createDidEthr } from '@kaytrust/did-ethr';

// Dirección Ethereum o clave pública asociada a tu cuenta
const addressOrPublicKey = "<YOUR_ADDRESS_OR_PUBLIC_KEY>";

// ID de la red (opcional, por defecto es Ethereum Mainnet)
const chainId = 80002; // Amoy (Polygon)

// Crear un objeto DID basado en Ethereum
const didEthr = createDidEthr(addressOrPublicKey, { chainNameOrId: chainId });

// Imprimir el DID generado
console.log(didEthr.did); // Ejemplo: "did:ethr:0x13882:<address_or_public_key>"
```

#### **Resultado**
El DID generado tendrá el siguiente formato:
```
did:ethr:<chain_namespace>:<address_or_public_key>
```

---

### **2. Creación Completa de un DID**

Esta forma de creación permite interactuar con la blockchain, lo que incluye registrar el DID en un contrato inteligente, añadir delegados o transferir la propiedad del DID. Para esto, se necesita la clave privada y un RPC URL.

#### **Ejemplo de Código**
```ts
import { createDidEthrFromPrivateKeyAndRpc } from '@kaytrust/did-ethr';

// Clave privada de tu cuenta
const privateKey = "<YOUR_PRIVATE_KEY>";

// URL del nodo RPC de la red
const rpcUrl = "https://polygon-amoy.drpc.org"; // Amoy (Polygon)

// ID de la red y dirección del contrato EthereumDIDRegistry
const chainId = 80002; // Amoy (Polygon)
const contractAddress = "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8";

// Crear un objeto DID basado en Ethereum
const didEthr = createDidEthrFromPrivateKeyAndRpc(privateKey, rpcUrl, {
  chainNameOrId: chainId,
  registry: contractAddress,
});

// Imprimir el DID generado
console.log(didEthr.did); // Ejemplo: "did:ethr:0x13882:<address>"
```

---

## **Registrar un DID en el Contrato EthereumDIDRegistry**

Registrar un DID en el contrato permite que sea reconocido en la blockchain. Esto requiere fondos en la cuenta asociada a la clave privada.

#### **Ejemplo de Código**
```ts
// Registrar el DID en el contrato
const recipeHash = await didEthr.selfRegister();

// Imprimir el hash de la transacción
console.log(`Registro exitoso. Hash de la transacción: ${recipeHash}`);
```

---

## **Gestión de Delegados**

Los delegados son cuentas autorizadas para actuar en nombre de un DID. Puedes añadir, validar o revocar delegados utilizando los métodos proporcionados por la librería.

### **1. Añadir un Delegado**

#### **Ejemplo de Código**
```ts
// Dirección Ethereum del delegado
const delegateAddress = "<DELEGATE_ETH_ADDRESS>";

// Añadir el delegado
const recipeHash = await didEthr.addDelegate(delegateAddress);

// Imprimir el hash de la transacción
console.log(`Delegado añadido. Hash de la transacción: ${recipeHash}`);
```

---

### **2. Validar que el Delegado fue Añadido**

Puedes resolver el DID para verificar si el delegado fue añadido correctamente.

#### **Ejemplo de Código**
```ts
import { getResolver, Resolver } from '@kaytrust/did-ethr';

// Crear un resolver para la red Amoy (Polygon)
const didResolver = new Resolver(
  getResolver({
    chainId: 80002,
    rpcUrl: "https://polygon-amoy.drpc.org",
    registry: "0xBC56d0883ef228b2B16420E9002Ece0A46c893F8",
  })
);

// Resolver el DID
const doc = await didResolver.resolve(didEthr.did);

// Imprimir el documento resuelto
console.log(JSON.stringify(doc, null, 2));
```

#### **Ejemplo de Documento Resuelto**
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

### **3. Revocar un Delegado**

#### **Ejemplo de Código**
```ts
// Dirección Ethereum del delegado a revocar
const delegateAddress = "<DELEGATE_ETH_ADDRESS>";

// Revocar el delegado
const recipeHash = await didEthr.revokeDelegate(delegateAddress);

// Imprimir el hash de la transacción
console.log(`Delegado revocado. Hash de la transacción: ${recipeHash}`);
```

---

## **Casos de Uso**

1. **Identidad Autosoberana**:
   - Permite a los usuarios controlar su identidad sin depender de una autoridad central.

2. **Autenticación Descentralizada**:
   - Útil para aplicaciones que requieren autenticación basada en blockchain.

3. **Gestión de Delegados**:
   - Ideal para organizaciones que necesitan delegar permisos a diferentes cuentas.

---

## **Conclusión**

La librería `@kaytrust/did-ethr` simplifica la interacción con DIDs basados en Ethereum, proporcionando una API clara y bien documentada. Con esta guía, incluso los desarrolladores nuevos en el mundo de los DIDs y Ethereum pueden comenzar a trabajar con esta tecnología de manera efectiva.

--- 

Esta versión combina las fortalezas de ambos README, proporcionando claridad, ejemplos detallados, y una estructura modular adecuada tanto para principiantes como para desarrolladores experimentados.