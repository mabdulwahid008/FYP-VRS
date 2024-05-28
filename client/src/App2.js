import { ConnectWallet, useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { useState } from "react";
import { StakingABI, StakingAddress } from "./HELLO";

export default function App2() {
  const address = useAddress()
  const { contract } = useContract(StakingAddress, StakingABI)
  const { mutateAsync } = useContractWrite(contract, "convertACTtoUSDT");
  const [amount, setAmount] = useState(0)

  const convert = async() => {
    const x = await contract.call("unstake", [0])
    console.log(x);
  }
  
  return (
    <div className="flex-1 flex justify-center items-center h-screen">
      {address ?
        <>
          <input type="number" className="bg-slate-200" onChange={(e) => setAmount(e.target.value)}/>
          <button onClick={convert}>Send</button>
        </>
        :
        <ConnectWallet />
      }
    </div>
  );
}
