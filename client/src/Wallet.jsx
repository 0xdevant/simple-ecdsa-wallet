import { useState } from "react"
import server from "./server"
import { sha256 } from "ethereum-cryptography/sha256"

function Wallet({ address, setAddress, balance, setBalance, sendAmount, recipient, setSignature, setRecoveryBit, setHashedMsg }) {
  const [privateKey, setPrivateKey] = useState("")

  async function generateSig(evt) {
    evt.preventDefault()

    try {
      const {
        data: { sig, hashedMsg },
      } = await server.post("generateSig", {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        privateKey,
      })
      setPrivateKey("")
      setSignature(sig[0])
      setRecoveryBit(sig[1])
      setHashedMsg(hashedMsg)
    } catch (ex) {
      alert(ex.response.data.message)
    }
  }

  async function onChange(evt) {
    const address = evt.target.value
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`)
      setBalance(balance)
    } else {
      setBalance(0)
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      <hr />
      <form onSubmit={generateSig}>
        <label>
          Private Key
          <input required type="password" placeholder="Your Private Key won't be saved" value={privateKey} onChange={(evt) => setPrivateKey(evt.target.value)}></input>
          <input type="submit" className="button" value="Generate" />
        </label>
      </form>
    </div>
  )
}

export default Wallet
