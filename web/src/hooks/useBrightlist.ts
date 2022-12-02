import React, { useEffect, useState, useCallback } from "react";
import { useContract } from "./useMint"
import { useEthersJs } from "./useEthers"

const REMOVE = 'remove' 
const ADD = 'add' 

export const useModifyBrightlist = () => {
  const contract = useContract();
  const ethersjsInstance = useEthersJs();

	const request = useCallback(
		async ({ modification, address } : any) => {
      if (ethersjsInstance === null || contract === null) return;

			if (modification === REMOVE) {
				const res = await contract!.removeFromBrightlist([address])
				const receipt = await res.wait();
				console.log(receipt)

				return receipt
			} else if (modification === ADD) {
				const res = await contract!.addToBrightlist([address])
				const receipt = await res.wait();
				console.log(receipt)

				return receipt
			} else {
				return 
			}
		}, [ethersjsInstance, contract]);

	return [request]
}

