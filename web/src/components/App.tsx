import React from 'react';
import { useETHAccounts } from "../hooks/useEthers";

function App() {
  const account = useETHAccounts()[0];

	 return (
		<div className="Web3App">
			 <main>
				{ account ? account : <p> No account </p> }
			</main>		
		</div>
	 )
}

export default App;
