import { EthrDID as EthrDIDBase } from 'ethr-did'
import { RemoveFirstParameter } from './types'

type EthrDIDConstructParams = ConstructorParameters<typeof EthrDIDBase>
export type DIDConfig = ConstructorParameters<typeof EthrDIDBase>[0]

export class EthrDID extends EthrDIDBase {
    setOwner!: EthrDIDBase["changeOwner"]
    constructor(...params: EthrDIDConstructParams) {
        super(...params)
        this.setOwner = this.changeOwner.bind(this);
    }

    async selfRegister(...params: RemoveFirstParameter<EthrDIDBase["changeOwner"]>) {
        return this.setOwner(this.address, ...params)
    }
}

export default EthrDID