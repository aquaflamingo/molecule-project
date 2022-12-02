import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider as EthersJsWeb3Provider } from "@ethersproject/providers";

const getLibrary = (provider: any) => {
  const lib = new EthersJsWeb3Provider(provider);
  lib.pollingInterval = 1000;
  return lib;
};

type Props = {
  children: JSX.Element;
};

const Web3Provider = ({ children }: Props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
};

export default Web3Provider;
