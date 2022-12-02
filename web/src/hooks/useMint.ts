import React, { useEffect, useState, useCallback } from "react";
import { Contract, ethers } from "ethers";
import { useEthersJs } from "./useEthers";
import { useIPFSContentUpload, useIPFS } from "./useIPFS";
import { removeIPFSPrefix } from "../helpers/ipfs";
import { IPFSUploadArgs } from "../types"
import Patent from "../artifacts/contracts/Patent.sol/Patent.json";
import PatentDeployment from "../artifacts/deploy.json";
import { encrypt, generateSecret } from "../helpers/crypto";

const useContract = () => {
  const ethersjsInstance = useEthersJs();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    if (ethersjsInstance === null) return;

    const c = new ethers.Contract(
      PatentDeployment.address,
      Patent.abi,
      ethersjsInstance?.getSigner(0)
    );

    setContract(c);
  }, [ethersjsInstance]);

  return contract;
};

const useMintFlow = (account : string) => {
  const contract = useContract();
  const ethersjsInstance = useEthersJs();
  const ipfsUploadRequest = useIPFSContentUpload();

  const request = useCallback(
    async ({ metadata, content } : IPFSUploadArgs) => {
      if (ethersjsInstance === null || ipfsUploadRequest === null) return;

      console.log("Mint request received, starting upload...");

			const ptContent = JSON.stringify(content)
			const secret = generateSecret()
			const encryptedContent = encrypt(ptContent, secret)

			console.log("Encrypted content: ", encryptedContent) 
			console.log("Password: ", secret)
      const uploadResult = await ipfsUploadRequest({
        basename: "patent",
        content: encryptedContent,
        metadata: {
					...metadata
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

      const tx = await contract!.mint(account, tokenMetadata);

      // The transaction receipt contains events emitted while processing the transaction.
      const receipt = await tx.wait();
      const erc721Token = parseMintTxResponse(receipt, { ...uploadResult });

      console.log("ERC721 is", erc721Token);

      console.log("Successfully minted the token");

      return [erc721Token, tx.hash, secret];
    },
    [ethersjsInstance, ipfsUploadRequest]
  );

  return [request];
};

export default useMintFlow;

const parseMintTxResponse = (receipt :any, storageInformation : any) => {
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
