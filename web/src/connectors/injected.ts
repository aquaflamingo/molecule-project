import { InjectedConnector } from "@web3-react/injected-connector";

// injectedConnector provides a Web3 connector via the injected instance of Web3 from a browser extension.
// Typically this is the value of `window.ethereum`
const injectedConnector: InjectedConnector = new InjectedConnector({
  supportedChainIds: [
    1337, // Local RPC
    31337, // Hardhat network
    // TODO: Sepolia
  ],
});

export default injectedConnector;
