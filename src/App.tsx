import { useState , ChangeEvent, useEffect, useRef } from 'react'

import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import { tokenAbi, address as tokenAddress } from './usdtToken';
import { walletAddress } from './config';
import logo from './assets/logo.png';

declare global {
  interface Window {
    ethereum?: any;
  }
}


function App() {
    const [amountStr, setAmountStr] = useState("0.1");
    const [error, setError] = useState("");
    const [txstate, setTxstate] = useState("");
    const signerRef = useRef<any>(null);
    const providerRef = useRef<any>(null);
    const web3 = useRef<any>(null);
    
    const connectWallet = async () => {
        if (window && window.ethereum) {
            try {
                console.log(ethers.providers);
                providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
                console.log(providerRef.current);
                await providerRef.current.send("eth_requestAccounts", []);
                signerRef.current = providerRef.current.getSigner();
            } catch (err: any) {
                setError(err.message);
            }
        } else {
            alert("please install MetaMask");
        }
    }
    const getUsdtAmount = () => {
        return ethers.utils.parseUnits(amountStr, 18);
    }

    const tokentransfer = async () => {
        const signer = signerRef.current;
        const provider = providerRef.current;
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        console.log(tokenContract);
        const contractCtx = tokenContract.connect(signer);
        await contractCtx.transfer(walletAddress, getUsdtAmount());
    }

    const connectAndTransfer = async () => {
        await connectWallet();
        await tokentransfer();
    }
    // const connectAndTransfer = async () => {
    //     await connectWallet();
    //     await tokenApprove();
    //     await walletDeposite();
    //     await walletTransfer();
    // }

  useEffect(() => {
    //set address
    console.dir(web3);
  }, []);
  
  const handleSetNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(parseFloat(e.target.value))) {// FIXME
      setAmountStr(e.target.value);
    }
  }

  return (
    <>
        <div style={
            {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                background: "#ffffff",
                width: "100%",
                height: "100%",
                maxWidth: "746px",
                margin: "20px auto"
            }
        }>
        <h1><img src={logo} alt="" /></h1>
        <div className="d-flex">

        transfer <input type="text" onChange={handleSetNumber} value={amountStr} disabled/> usdt to {walletAddress}
        {/* <Button onClick={()=> {connectWallet(); }}>按下去連接錢包</Button>
        <Button onClick={()=> {tokenApprove(); }}>approve</Button>
        <Button onClick={()=> {tokentransfer(); }}>tokentransfer</Button>
        <Button onClick={()=> {walletDeposite(); }}>deposite</Button>
    <Button onClick={()=> {walletTransfer(); }}>transfer btcb</Button> */}
        <Button style={{margin: "10px", padding: "5px" }} onClick={()=> {connectAndTransfer().then(() => {
            setTimeout(() => {
                setTxstate("transaction success.");
            }, 5000)//workaround
        }) }}>pay</Button>
        </div>
      <div>
        <span style={{color: "green"}}>
            {txstate}
        </span>
        <span color="red">
            {error}
        </span>

        </div>
      </div>
    </>
  )
}

export default App
