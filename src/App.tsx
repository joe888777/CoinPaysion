import { useState , ChangeEvent, useEffect, useRef } from 'react'

import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import {abi, address as contractAddress } from './transferUsdtContract';
import { tokenAbi, address as tokenAddress } from './usdtToken';
import { routerAbi, address as routerAddress } from './pancakeRouter';
import { walletAddress, btcbAddress } from './config';
import './App.css'


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
            } catch (err: Error) {
                setError(err.message);
            }
            
        } else {
            alert("please install MetaMask");
        }
    }
    const getUsdtAmount = () => {
        return BigInt(parseFloat(amountStr)*1000000000000000000);
    }
    const tokenApprove = async () => {
        const signer = signerRef.current;
        const provider = providerRef.current;
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        console.log(tokenContract);
        const contractCtx = tokenContract.connect(signer);
        contractCtx.approve(contractAddress, getUsdtAmount());
    }

    const walletTransfer = async () => {
        const signer = signerRef.current;
        const provider = providerRef.current;
        const contract = new ethers.Contract(contractAddress, abi, provider);
        console.log(contract);
        const contractCtx = contract.connect(signer);
        contractCtx.transferUsdt(btcbAddress, walletAddress, getUsdtAmount());
    }
    const walletDeposite = async () => {
        const signer = signerRef.current;
        const provider = providerRef.current;
        const contract = new ethers.Contract(contractAddress, abi, provider);
        console.log(contract);
        const contractCtx = contract.connect(signer);
        contractCtx.deposite(btcbAddress, getUsdtAmount());
    }

    const connectAndTransfer = async () => {
        await connectWallet();
        await tokenApprove();
        await walletDeposite();
        await walletTransfer();
    }
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
        <div>
        <h1>CoinPaysion</h1>
        transfer <input type="text" onChange={handleSetNumber} value={amountStr} disabled/> usdt to {walletAddress}
        {/* <Button onClick={()=> {connectWallet(); }}>按下去連接錢包</Button>
        <Button onClick={()=> {tokenApprove(); }}>approve</Button>
        <Button onClick={()=> {walletDeposite(); }}>deposite</Button> */}
        {/* <Button onClick={()=> {walletTransfer(); }}>transfer btcb</Button> */}
        <Button onClick={()=> {connectAndTransfer().then(() => {
            setTxstate("transaction success.");
        }) }}>combine</Button>
      <div>
        <span color="green">
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
