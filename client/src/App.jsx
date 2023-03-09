import Wallet from "./Wallet"
import Transfer from "./Transfer"
import "./App.scss"
import { useState } from "react"

function App() {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [hashedMsg, setHashedMsg] = useState("")
  const [signature, setSignature] = useState("")
  const [recoveryBit, setRecoveryBit] = useState("")

  return (
    <div className="app">
      <Wallet balance={balance} setBalance={setBalance} address={address} setAddress={setAddress} sendAmount={sendAmount} recipient={recipient} setHashedMsg={setHashedMsg} setSignature={setSignature} setRecoveryBit={setRecoveryBit} />
      <Transfer
        setBalance={setBalance}
        address={address}
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        recipient={recipient}
        setRecipient={setRecipient}
        hashedMsg={hashedMsg}
        signature={signature}
        setSignature={setSignature}
        recoveryBit={recoveryBit}
      />
    </div>
  )
}

export default App
