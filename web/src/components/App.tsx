import React, { useState } from 'react';
import { useETHAccounts } from "../hooks/useEthers";
import MintForm from "./MintForm"

function App() {
  const account = useETHAccounts()[0];
	const [success, setSuccess] = useState(false)
	const [key, setKey] = useState("???????")

	const onSuccess = (mintResult : any) => {
		alert("Success your token was minted" + mintResult)
		localStorage.setItem("key", mintResult.key)
		setSuccess(true)
		setKey(mintResult.encryptionKey)
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(key)
		alert("Copied")
	}

	 return (
		<div className="Web3App">
			 <main>
				{ account ? account : <p> No account </p> }
				<MintForm onSuccess={onSuccess} />

				{ success ? 
					<div>
						<input disabled type="text" name="encryption" value={key}/>
						<button style={{backgroundColor: "#2FF58E"}} onClick={handleCopy}>Copy</button>
					</div> : <br/> }
			</main>		
		</div>
	 )
}

export default App;
