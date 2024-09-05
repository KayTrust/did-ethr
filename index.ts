export * from './src'

type EnvVars = Partial<{
    RPC_AMOY: string,
    CONTRACT_REGISTRY_AMOY: string,
    RPC_CARDONA: string,
    CONTRACT_REGISTRY_CARDONA: string,
    TEST_KEY_1: string
    TEST_KEY_2: string
    // TEST_WITH_CHANGE_OWNER: string|number|boolean
    // TEST_WITH_RECOVER_OWNER: string|number|boolean
    TEST_WITH_OWNER_ACTION: 'recover' | 'change' | 'self-register'
}>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvVars {
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}
