pragma solidity ^0.8.18;
// SPDX-License-Identifier: MIT

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract FeeCollector  {
    uint256 public balance;
    
    event TransferReceived(address _from, uint _amount);
    event TransferSent(address _from, address _destAddr, uint _amount);
    
    constructor() {
    }

    receive() payable external {
        balance += msg.value;
        emit TransferReceived(msg.sender, msg.value);
    }
 
    function deposite(IBEP20 token, uint256 amount) external payable {
        uint256 erc20balance = token.balanceOf(msg.sender);
        require(amount <= erc20balance, "balance is low");
        token.approve(address(this), amount);
        token.transferFrom(msg.sender, address(this), amount);
    }

    function transferUsdt(IBEP20 token, address to, uint256 amount) external  {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "bad amount");
        token.transfer(to, amount);
        emit TransferSent(msg.sender, to, amount);
    }
}