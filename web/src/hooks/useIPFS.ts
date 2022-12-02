import React, { useEffect, useState, useCallback } from "react";
import { create as CreateIPFSClient, HTTPClientExtraOptions, IPFSHTTPClient} from "ipfs-http-client";
import config from "../config";
import { ensureIPFSPrefix } from "../helpers/ipfs";

const IPFS_ADD_OPTIONS = {
  cidVersion: 1,
  hashAlg: "sha2-256",
};

export const useIPFS = () => {
  const [ipfsClient, setIPFSClient] = useState<IPFSHTTPClient>();

  useEffect(() => {
    setIPFSClient(CreateIPFSClient({ url: config.IPFS_HTTP_API_URL }));
    console.log("IPFS Client is Online");
  }, []);

  return ipfsClient;
};

export const useIPFSContentUpload = () => {
	const ipfs = useIPFS()

  const upload = useCallback(async (data : any) => {
    console.log("useIPFSContentUpload called with:", data);

		const importCandidate = { 
				path: "/nft/" + data.basename, 
				content: data.content
			}

    const { cid: assetCid } = await ipfs!.add(
			importCandidate,
			IPFS_ADD_OPTIONS as HTTPClientExtraOptions
    );

		console.log("Added asset to ipfs", assetCid) 

    // Create the NFT metadata JSON
    const assetURI = ensureIPFSPrefix(assetCid.toString()) + "/" + data.basename;
    const metadata = { ...data.metadata, uri: assetURI };

    // add the metadata to IPFS
    const { cid: metadataCid } = await ipfs!.add(
      { path: "/nft/metadata.json", content: JSON.stringify(metadata) },
      IPFS_ADD_OPTIONS as HTTPClientExtraOptions
    );
    const metadataURI = ensureIPFSPrefix(metadataCid.toString()) + "/metadata.json";

    return {
      metadataURI: metadataURI,
      assetURI: assetURI,
    };
  }, [ipfs]);

  return upload;
};
