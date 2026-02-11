import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

console.log('BitClaw Wallet Generated:')
console.log('Address:', account.address)
console.log('Private Key:', privateKey)
console.log('\n⚠️ SAVE THESE SECURELY - NEEDED FOR 80% FEE COLLECTION')