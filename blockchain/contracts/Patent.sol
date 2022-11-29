// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Patent is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => bool) public brightlist;

    constructor() ERC721("Patent", "PAT") public {

    }

    /**
     * @notice Add to brightlist
     */
    function addToBrightlist(address[] calldata toAddAddresses) 
    external onlyOwner
    {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            brightlist[toAddAddresses[i]] = true;
        }
    }

    /**
     * @notice Remove from brightlist
     */
    function removeFromBrightlist(address[] calldata toRemoveAddresses)
    external onlyOwner
    {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete brightlist[toRemoveAddresses[i]];
        }
    }

    /**
     * @notice Function with brightlist
     */
    function _validate() 
		external
    {
        require(brightlist[msg.sender], "NOT_IN_BRIGHTLIST");
    }

    function mint(address who, string memory tokenURI) public returns (uint256) {
				_validate();

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(who, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
