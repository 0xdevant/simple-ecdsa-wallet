import { useState } from "react"
import server from "./server"

function Transfer({ address, setBalance, sendAmount, setSendAmount, recipient, setRecipient, hashedMsg, signature, setSignature, recoveryBit }) {
  const setValue = (setter) => (evt) => setter(evt.target.value)

  async function transfer(evt) {
    evt.preventDefault()

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        hashedMsg,
        signature,
        recoveryBit,
      })
      setBalance(balance)
    } catch (ex) {
      alert(ex.response.data.message)
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input required placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
      </label>

      <label>
        Recipient
        <input required placeholder="Type an address, for example: 0x2" value={recipient} onChange={setValue(setRecipient)}></input>
      </label>

      <label>
        Signature
        <input required style={{ background: "#e2e8f0"}} placeholder="Signature will be auto-filled" value={signature} onChange={setValue(setSignature)} disabled></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  )
}

export default Transfer
