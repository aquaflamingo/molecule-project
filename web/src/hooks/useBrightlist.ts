import React, { useEffect, useState, useCallback } from "react";
import { useContract } from "./useMint"
import { useEthersJs } from "./useEthers"

const REMOVE = 'remove' 
const ADD = 'add' 

type ModArgs = {
	modification : string 
	address : string
}

const useModifyBrightlist = () => {
  const contract = useContract();
  const ethersjsInstance = useEthersJs();

	const request = useCallback(
		async ({ modification, address } : ModArgs) => {
      if (ethersjsInstance === null || contract === null) return;

			if (modification === REMOVE) {
				console.log("running remove")
				const res = await contract!.removeFromBrightlist([address])
				const receipt = await res.wait();
				console.log(receipt)

				return [receipt]
			} else if (modification === ADD) {
				console.log("running add")
				const res = await contract!.addToBrightlist([address])
				const receipt = await res.wait();
				console.log(receipt)

				return [receipt]
			} else {
				return []
			}
		}, [ethersjsInstance, contract]);

	return [request]
}

export { useModifyBrightlist }
