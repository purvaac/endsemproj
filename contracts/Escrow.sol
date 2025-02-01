// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public client;
    address public freelancer;
    uint public amount;
    bool public isPaid;
    bool public isDisputed;

    constructor(address _freelancer) payable {
        client = msg.sender; // The person who creates the escrow is the client
        freelancer = _freelancer;
        amount = msg.value; // The escrow amount sent during contract creation
        isPaid = false;
        isDisputed = false;
    }

    // Release payment to freelancer
    function releasePayment() public {
        require(msg.sender == client, "Only client can release payment");
        require(!isPaid, "Payment already released");
        require(!isDisputed, "Payment is disputed");

        isPaid = true;
        payable(freelancer).transfer(amount);
    }

    // Client can dispute the payment
    function dispute() public {
        require(msg.sender == client, "Only client can dispute");
        require(!isPaid, "Payment already released");

        isDisputed = true;
    }

    // Get contract balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
