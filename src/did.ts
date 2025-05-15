import { EthrDID as EthrDIDBase } from 'ethr-did'
import { RemoveFirstParameter } from './types'
import {Issuer, IssuerEcAlg} from '@kaytrust/did-base'

type EthrDIDConstructParams = ConstructorParameters<typeof EthrDIDBase>
export type DIDConfig = ConstructorParameters<typeof EthrDIDBase>[0]

export class EthrDID extends EthrDIDBase implements Issuer<IssuerEcAlg> {
    setOwner!: EthrDIDBase["changeOwner"]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    declare signer: Issuer["signer"]
    constructor(...params: EthrDIDConstructParams) {
        super(...params)
        this.setOwner = this.changeOwner.bind(this);
    }

    async selfRegister(...params: RemoveFirstParameter<EthrDIDBase["changeOwner"]>) {
        return this.setOwner(this.address, ...params)
    }
}

export default EthrDID