import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";
import { useETHAccounts } from "../../hooks/useEthers.js";


const Web3App = () => {
  // Fetch the ETH account from Web3 Provider
  const account = useETHAccounts()[0];

	 return (
		<div className="Web3App">
		 <main>
        {!account ? (
          <p> Has account </p>
        ) : (
					<p> No account </p>
        )}
		</main>		</div>
	 )
}

export default Web3App
