// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @notice Educational local-chain demonstration. Not audited; never use real funds.
contract MilestoneEscrow {
    enum State { None, Funded, Submitted, Disputed, Resolved }
    struct Deal {
        address customer;
        address provider;
        address arbitrator;
        uint256 amount;
        uint256 deadline;
        bytes32 termsHash;
        State state;
    }
    mapping(uint256 => Deal) public deals;
    mapping(address => uint256) public credits;
    uint256 public nextDealId;
    uint256 public lockedTotal;
    uint256 public creditTotal;
    bool private entered;
    event Created(uint256 indexed id, address indexed customer, address indexed provider, uint256 amount);
    event Submitted(uint256 indexed id);
    event Disputed(uint256 indexed id);
    event Allocated(uint256 indexed id, uint256 customerAmount, uint256 providerAmount);
    event Withdrawn(address indexed account, uint256 amount);

    constructor() { require(block.chainid == 31337, "Local chain only"); }
    modifier nonReentrant() {
        require(!entered, "Reentrancy"); entered = true; _; entered = false;
    }
    function createDeal(address provider, address arbitrator, uint256 deadline, bytes32 termsHash)
        external payable returns (uint256 id)
    {
        require(msg.value > 0, "Zero amount");
        require(provider != address(0) && arbitrator != address(0), "Zero role");
        require(provider != msg.sender && arbitrator != msg.sender && provider != arbitrator, "Distinct roles");
        require(deadline > block.timestamp, "Past deadline");
        require(termsHash != bytes32(0), "Missing terms");
        id = nextDealId++;
        deals[id] = Deal(msg.sender, provider, arbitrator, msg.value, deadline, termsHash, State.Funded);
        lockedTotal += msg.value;
        emit Created(id, msg.sender, provider, msg.value);
    }
    function submitDelivery(uint256 id) external {
        Deal storage d = deals[id];
        require(msg.sender == d.provider, "Provider only");
        require(d.state == State.Funded, "Wrong state");
        require(block.timestamp <= d.deadline, "Deadline passed");
        d.state = State.Submitted; emit Submitted(id);
    }
    function accept(uint256 id) external {
        Deal storage d = deals[id];
        require(msg.sender == d.customer, "Customer only");
        require(d.state == State.Submitted, "Wrong state");
        _allocate(id, d, 0);
    }
    function openDispute(uint256 id) external {
        Deal storage d = deals[id];
        require(msg.sender == d.customer || msg.sender == d.provider, "Party only");
        require(d.state == State.Funded || d.state == State.Submitted, "Wrong state");
        d.state = State.Disputed; emit Disputed(id);
    }
    function requestResolution(uint256 id) external {
        Deal storage d = deals[id];
        require(msg.sender == d.customer || msg.sender == d.provider, "Party only");
        require(d.state == State.Funded || d.state == State.Submitted, "Wrong state");
        require(block.timestamp > d.deadline, "Not expired");
        d.state = State.Disputed; emit Disputed(id);
    }
    function resolve(uint256 id, uint256 customerAmount) external {
        Deal storage d = deals[id];
        require(msg.sender == d.arbitrator, "Arbitrator only");
        require(d.state == State.Disputed, "Wrong state");
        require(customerAmount <= d.amount, "Exceeds balance");
        _allocate(id, d, customerAmount);
    }
    function _allocate(uint256 id, Deal storage d, uint256 customerAmount) private {
        uint256 amount = d.amount;
        d.state = State.Resolved;
        lockedTotal -= amount;
        credits[d.customer] += customerAmount;
        credits[d.provider] += amount - customerAmount;
        creditTotal += amount;
        emit Allocated(id, customerAmount, amount - customerAmount);
    }
    function withdraw() external nonReentrant {
        uint256 amount = credits[msg.sender];
        require(amount > 0, "No credit");
        credits[msg.sender] = 0; creditTotal -= amount;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }
}
