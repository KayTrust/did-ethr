import { Wallet, JsonRpcProvider, WebSocketProvider } from "ethers";
import { EthrDID, DIDConfig } from "./did";
import { getChainIdFromChainNameOrId } from "./utils";

type IConfig = Omit<DIDConfig, 'identifier'>

type WithId<T> = T & {
    identifier?: string
}

export function createDidEthr(addressOrPublicKey: string, config?: IConfig) {
    const ethrDid = new EthrDID({ ...config, identifier: addressOrPublicKey });
    return ethrDid
}

export function createDidEthrFromWallet(wallet: Wallet, config?: Pick<IConfig, 'chainNameOrId' | 'rpcUrl' | 'registry' | 'provider'>) {
    if (!wallet.provider && !config?.rpcUrl && !config?.provider) throw new Error(" either a provider or rpcUrl is required to initialize");
    return createDidEthr(wallet.address, {...config, txSigner: wallet, provider: wallet.provider||config?.provider})
}

type ConfToWalletWithProvider= WithId<Pick<IConfig, 'chainNameOrId' | 'registry' | 'alg' | 'privateKey'>>

export function createDidEthrFromWalletWithProvider(wallet: Wallet, config?: ConfToWalletWithProvider) {
    if (!wallet.provider) throw new Error(" a wallet.provider is required to initialize");
    const id = config?.identifier || wallet.address;
    return createDidEthr(id, {...config, txSigner: wallet, provider: wallet.provider})
}

type ConfToPrivateKeyAndRpc = ConfToWalletWithProvider

export function createDidEthrFromPrivateKeyAndRpc(privateKey: Required<IConfig>["privateKey"], rpcUrl: Required<IConfig>["rpcUrl"], conf?: ConfToPrivateKeyAndRpc) {
    let chainId = conf ? getChainIdFromChainNameOrId(conf.chainNameOrId) : undefined;
    const provider = rpcUrl.startsWith('ws.') || rpcUrl.startsWith('wss.') ? new WebSocketProvider(rpcUrl, chainId || 'any') : new JsonRpcProvider(rpcUrl, chainId || 'any')
    const wallet = new Wallet(privateKey, provider)
    return createDidEthrFromWalletWithProvider(wallet, {...conf, privateKey})
}