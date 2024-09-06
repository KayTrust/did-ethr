export type RemoveFirstParameter<T extends (...args: any) => any> = T extends (arg1: any, ...rest: infer R) => any ? R : never;

import type {RPC_AMOY_DEFAULT} from './constants'

declare global {
    namespace NodeJS {
        type EnvVars = Partial<{
            /**
             * 
             * ENV VARS FOR TEST PURPOSE
             * 
             */

            /**
             * Customize the RPC URL used to connect to the contract on the Amoy network. 
             * Replace the public RPC
             * {@link RPC_AMOY_DEFAULT}
             */
            RPC_AMOY: string,

            /** Customize address of EthereumDIDRegistry on Amoy network */
            CONTRACT_REGISTRY_AMOY: string,

            /**
             * Customize the RPC URL used to connect to the contract on the Cardona network. 
             * Replace the public RPC
             */
            RPC_CARDONA: string,

            /** Customize address of EthereumDIDRegistry on Cardona network */
            CONTRACT_REGISTRY_CARDONA: string,

            /**
             * To test the change of owner of the did associated with the private key on the contract. Requires that the account has funds in the network
             * Allows testing with an account that have funds (tokens).
             */
            TEST_KEY_1: string

            /**
             * To test the return of ownership of the did to the original owner using the private key of this second owner within the contract. It requires that the account has funds in the network
             * Allows testing with an account that have funds (tokens).
             */
            TEST_KEY_2: string

            /**
             * Determines the type of action in the ownership test of a did: `change`, changes 
             * the ownership of the did to another account; `revert`, returns the ownership of 
             * the did to the original owner; and `self-register`, registers the did 
             * to its owner within the contract.
             * It is related to the variable {@link EnvVars.TEST_KEY_1} and {@link EnvVars.TEST_KEY_2}
             */
            TEST_WITH_OWNER_ACTION: 'change' | 'recover' | 'self-register'
        }>
        interface ProcessEnv extends EnvVars {
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}