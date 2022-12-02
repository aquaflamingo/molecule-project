import { useWeb3React } from "@web3-react/core";
import injectedConnector from "../connectors/injected";
import Button from "react-bootstrap/Button";

// Web3Connect is responsible for rendering the initial connect button
// to initiate Web3 connection using the Web3React hook to communicate with
// the Web3Provider.

type Props = {
  children: JSX.Element;
};

const Web3Connect = ({ children }: Props) => {
  const { active, activate } = useWeb3React();

  // Attempts to activate the Web3 connection using the injectedConnector
  const connectToWeb3 = () => {
    console.log("Web3Connect: Web3 Activating");

    activate(injectedConnector, undefined, true).catch((err) => {
      console.log("Web3Connect: Web3 Failed to activate");
      console.error(err);
      alert(`Failed to connect to web3 ${err}`);
      debugger;
    });
  };

  console.log("Web3Connect: active is ", active);

  return active ? (
    <div>{children}</div>
  ) : (
    <PleaseConnectWallet connect={connectToWeb3} />
  );
};

type PleaseConnectWalletProps = {
  connect: () => void;
};

const PleaseConnectWallet = ({ connect }: PleaseConnectWalletProps) => {
  return (
    <div>
      <h1>Wallet required</h1>
      <p>
        This is a Web3 application and requires an injected provider like
        Metamask
      </p>
      <p>
        <strong>Please ensure you are connected to Goerli</strong>
      </p>

      <Button type="button" onClick={() => connect()}>
        Connect
      </Button>
    </div>
  );
};

export default Web3Connect;
