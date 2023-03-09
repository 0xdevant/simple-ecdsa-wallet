const secp = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { toHex } = require("ethereum-cryptography/utils")
const fs = require("fs")

let exampleAccounts = []

for (let i = 0; i < 3; i++) {
  const sk = toHex(secp.utils.randomPrivateKey())
  const pk = `0x${toHex(keccak256(secp.getPublicKey(sk).slice(1)).slice(-20))}`
  exampleAccounts.push({ pk, sk })
}

fs.writeFileSync(`${__dirname}/../data/index.js`, `module.exports = ${JSON.stringify(exampleAccounts)}`)
