import React from 'react';
import { useETHAccounts } from "../hooks/useEthers";
import MintForm from "./MintForm"

function App() {
  const account = useETHAccounts()[0];

	const func = ()=>{}

	 return (
		<div className="Web3App">
			 <main>
				{ account ? account : <p> No account </p> }
				<MintForm onSuccess={()=>{}} />
			</main>		
		</div>
	 )
}

export default App;
