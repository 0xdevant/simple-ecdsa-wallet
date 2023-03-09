const express = require("express")
const app = express()
const cors = require("cors")
const secp = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes } = require("ethereum-cryptography/utils")
const { hexToBytes, toHex } = require("ethereum-cryptography/utils")
// const { sha256 } = require("ethereum-cryptography/sha256")
const port = 3042

app.use(cors())
app.use(express.json())

const exampleWallets = require("./data/index")

let balances = {}
for (let arr = [100, 50, 75], i = 0; i < arr.length; i++) {
  balances[exampleWallets[i].pk] = arr[i]
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post("/generateSig", async (req, res) => {
  const { sender, amount, recipient, privateKey } = req.body

  if (!sender || !recipient || !amount || !privateKey) {
    return res.status(400).send({ message: "Must fill in sender, recipient, amount and privateKey!" })
  }

  // const hashedPrivateKey = toHex(sha256(utf8ToBytes(privateKey)))
  const hashedMsg = toHex(hashMessage(`${sender} send ${recipient} ${amount} at ${Date.now()}`))

  await signMessage(hashedMsg, privateKey)
    .then((response) => {
      // consists of signature and recovery bit
      response[0] = toHex(response[0])
      res.send({ sig: response, hashedMsg })
    })
    .catch((err) => {
      res.status(400).send({ message: err.message })
    })
})

app.post("/send", (req, res) => {
  const { sender, amount, recipient, hashedMsg, signature, recoveryBit } = req.body

  setInitialBalance(sender)
  setInitialBalance(recipient)

  const recoveredETHAddress = getETHAddress(recoverPublicKey(hexToBytes(hashedMsg), hexToBytes(signature), recoveryBit))
  if (!isValidSig(sender, recoveredETHAddress)) {
    return res.status(400).send({ message: "Wrong singature!" })
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" })
  } else {
    balances[sender] -= amount
    balances[recipient] += amount
    res.send({ balance: balances[sender] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message))
}

async function signMessage(hashedMsg, privateKey) {
  return await secp.sign(hashedMsg, privateKey, { recovered: true })
}

function recoverPublicKey(hashedMsg, signature, recoveryBit) {
  return secp.recoverPublicKey(hashedMsg, signature, recoveryBit)
}

function isValidSig(sender, recoveredPublicKey) {
  return sender === recoveredPublicKey
}

function getETHAddress(publicKey) {
  return `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`
}
