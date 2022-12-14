import React, { useEffect, useState, useCallback } from "react";
import { Contract, ethers } from "ethers";
import { useETHAccounts, useEthersJs } from "./useEthers";
import { useIPFSContentUpload, useIPFS } from "./useIPFS";
import { removeIPFSPrefix } from "../helpers/ipfs";
import { IPFSUploadArgs } from "../types";
import Patent from "../artifacts/contracts/Patent.sol/Patent.json";
import PatentDeployment from "../artifacts/deploy.json";
import { encrypt, generateSecret } from "../helpers/crypto";

export const useContract = () => {
  const ethersjsInstance = useEthersJs();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    if (ethersjsInstance === undefined) return;

    const signer = ethersjsInstance!.getSigner(0);

    const c = new ethers.Contract(PatentDeployment.address, Patent.abi, signer);

    setContract(c);
  }, [ethersjsInstance]);

  return contract;
};

const useMint = (account: string) => {
  const ethersjsInstance = useEthersJs();
  const contract = useContract();
  const ipfsUploadRequest = useIPFSContentUpload();

  const request = useCallback(
    async ({ metadata, content }: IPFSUploadArgs) => {
      if (
        ethersjsInstance === undefined ||
        ipfsUploadRequest === undefined ||
        contract === undefined
      )
        return [
          null,
          null,
          null,
          new Error("EthersJS, IPFS or contract is undefined"),
        ];

      console.log("Mint request received, starting upload...");

      try {
        const ptContent = JSON.stringify(content);
        const secret = generateSecret();
        const encryptedContent = encrypt(ptContent, secret);

        const uploadResult = await ipfsUploadRequest({
          basename: "patent",
          content: encryptedContent,
          metadata: {
            ...metadata,
          },
        });

        console.log(
          "Storage upload completed. URI: ",
          uploadResult!.assetURI,
          "Metadata URI:",
          uploadResult!.metadataURI,
          "Starting token mint..."
        );

        // Strip the IPFS prefix which is appended to the metadataURI.
        //
        const tokenMetadata = removeIPFSPrefix(uploadResult!.metadataURI);

        console.log("Trying to mint for account: ", account);
        const tx = await contract!.mint(account, tokenMetadata);

        // The transaction receipt contains events emitted while processing the transaction.
        const receipt = await tx.wait();
        const erc721Token = parseMintTxResponse(receipt, { ...uploadResult });

        console.log("ERC721 is", erc721Token);

        console.log("Successfully minted the token");

        return [erc721Token, tx.hash, secret];
      } catch (error) {
        // Catch error
        const brightlist = isBrightlistError(error);
        return [null, null, null, error, brightlist];
      }
    },
    [ethersjsInstance, ipfsUploadRequest, contract, account]
  );

  return [request];
};

export default useMint;

const isBrightlistError = (err: any) => {
  if (err.message.includes("NOT_IN_BRIGHTLIST")) {
    return true;
  } else {
    return false;
  }
};
const parseMintTxResponse = (receipt: any, storageInformation: any) => {
  console.log(
    "Token mint requested, received response.",
    "Filtering ",
    receipt.events.length,
    "events..."
  );
  for (const event of receipt.events) {
    if (event.event !== "Transfer") {
      console.log("ignoring unknown event type ", event.event);
      continue;
    }

    const tokenId = event.args.tokenId.toString();
    console.log("Token mint succeeded.");

    console.log(
      "id:",
      tokenId,
      "assetURI:",
      removeIPFSPrefix(storageInformation.assetURI),
      "metadataURI:",
      removeIPFSPrefix(storageInformation.metadataURI)
    );

    // return token id, asset and metadata
    return {
      id: tokenId,
      asset: {
        uri: storageInformation.assetURI,
        cid: removeIPFSPrefix(storageInformation.assetURI),
      },
      metadata: {
        uri: storageInformation.metadataURI,
        cid: removeIPFSPrefix(storageInformation.metadataURI),
      },
    };
  }
};
