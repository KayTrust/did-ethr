import { deployments } from "ethr-did-resolver";

export function parseBoolean(value?: string|number|boolean): boolean {
    if (!value) return false;
    if (typeof(value) === "boolean") return value;
    if (typeof(value) === "number" || /^\d+$/.test(value.trim())) {
        return !!value
    }
    if (value.trim().toLowerCase() === "true") return true;
    return false;
}


export function getChainIdFromChainNameOrId(chainNameOrId: string|number|bigint|undefined): bigint|undefined {
    let chainId: bigint | undefined = undefined;
    switch (typeof chainNameOrId) {
        case "bigint":
            chainId = chainNameOrId
            break;
        case "number":
            chainId = BigInt(chainNameOrId)
            break;
        case 'string':
            try {
                chainId = BigInt(chainNameOrId)
            } catch (error) {
                const chainIdFound = deployments.find((d) => d.name === chainNameOrId)?.chainId
                if (chainIdFound) chainId = BigInt(chainIdFound);
            }
            break;
    }
    return chainId;
}