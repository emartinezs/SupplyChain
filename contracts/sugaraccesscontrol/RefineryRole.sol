// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the library 'Roles'
import "./Roles.sol";
import "../sugarcore/Ownable.sol";

// Define a contract 'RefineryRole' to manage this role - add, remove, check
contract RefineryRole is Ownable {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event RefineryAdded(address indexed account);
  event RefineryRemoved(address indexed account);

  // Define a struct 'refineries' by inheriting from 'Roles' library, struct Role
  Roles.Role private refineries;

  // In the constructor make the address that deploys this contract the 1st refinery
  constructor() {
    _addRefinery(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRefinery() {
    require(isRefinery(msg.sender));
    _;
  }

  // Define a function 'isRefinery' to check this role
  function isRefinery(address account) public view returns (bool) {
    return refineries.has(account);
  }

  // Define a function 'addRefinery' that adds this role
  function addRefinery(address account) public onlyRefinery {
    _addRefinery(account);
  }

  // Define a function 'renounceRefinery' to renounce this role
  function renounceRefinery() public {
    _removeRefinery(msg.sender);
  }

  // Define an internal function '_addRefinery' to add this role, called by 'addRefinery'
  function _addRefinery(address account) internal {
    refineries.add(account);
    emit RefineryAdded(account);(account);
  }

  // Define an internal function '_removeRefinery' to remove this role, called by 'removeRefinery'
  function _removeRefinery(address account) internal {
    refineries.remove(account);
    emit RefineryRemoved(account);(account);
  }
}