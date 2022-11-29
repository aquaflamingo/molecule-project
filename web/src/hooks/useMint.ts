import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { useEthersJs } from "./useEthers";
import { useIPFSContentUpload } from "./useIPFS";
import { removeIPFSPrefix } from "../helpers/ipfs";
import { IPFSUploadArgs } from "../types"

// TODO
import Artifacts from "@molecule/contracts";

const Patent = Artifacts.contracts.Patent;

const useContract = () => {
  const ethersjsInstance = useEthersJs();
  const [contract, setContract] = useState([]);

  useEffect(() => {
    if (ethersjsInstance === null) return;

    const c = new ethers.Contract(
      Patent.address,
      Patent.abi,
			// TODO: ownable
      ethersjsInstance?.getSigner(0)
    );

		// FIXME:
    setContract(c);
  }, [ethersjsInstance]);

  return contract;
};

const useMintFlow = (account : string) => {
  const contract = useContract();
  const ethersjsInstance = useEthersJs();
  const ipfsUploadRequest = useIPFSContentUpload();

  const request = useCallback(
    async ({ data, content } : IPFSUploadArgs) => {
      if (ethersjsInstance === null || ipfsUploadRequest === null) return;

      console.log("Mint request received, starting upload...");

			// FIXME: encrypt
      const uploadResult = await ipfsUploadRequest({
        basename: "patent",
				// FIXME: encrypted
        content: content,
        metadata: {
					...data.draft
        },
      });

      console.log(
        "Storage upload completed. URI: ",
        uploadResult.assetURI,
        "Metadata URI:",
        uploadResult.metadataURI,
        "Starting token mint..."
      );

      // Strip the IPFS prefix which is appended to the metadataURI.
      //
      const tokenMetadata = removeIPFSPrefix(uploadResult.metadataURI);

      const tx = await contract.mint(account, tokenMetadata);

      // The transaction receipt contains events emitted while processing the transaction.
      const receipt = await tx.wait();
      const erc721Token = parseMintTxResponse(receipt, { ...uploadResult });

      console.log("ERC721 is", erc721Token);

      console.log("Successfully minted the token");

      return [erc721Token, tx.hash];
    },
    [ethersjsInstance, createMintEventRequest, ipfsUploadRequest]
  );
  return [createEventResult, request];
};

export default useMintFlow;

const parseMintTxResponse = (receipt, storageInformation) => {
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
      storageInformation.assetURI,
      "metadataURI:",
      storageInformation.metadataURI
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
