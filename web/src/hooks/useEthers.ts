import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider as EthersJsProvider } from "@ethersproject/providers";

export const useEthersJs = () => {
  const { active, connector } = useWeb3React();
  const [ethersjsInstance, setEthersJs] = useState<EthersJsProvider>();

  useEffect(() => {
    connector?.getProvider().then((provider) => {
      const instance: EthersJsProvider = new EthersJsProvider(provider);
      setEthersJs(instance);
    });
  }, [active, connector]);

  return ethersjsInstance;
};

export const useETHAccounts = () => {
  const ethersjsInstance = useEthersJs();
  const [accounts, setAccounts] = useState<Array<string>>([]);

  useEffect(() => {
    if (ethersjsInstance === null) {
      return;
    }

    ethersjsInstance
      ?.listAccounts()
      .then((accounts) => {
        setAccounts(accounts);
      })
      .catch((err) => {
        debugger;
        console.error(err);
      });
  }, [ethersjsInstance]);

  return accounts;
};
