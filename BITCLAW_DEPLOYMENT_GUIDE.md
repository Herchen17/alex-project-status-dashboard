# BitClaw Protocol Deployment Guide

## 🪖 Revolutionary Tokenomics Implementation

This is the **real** BitClaw Protocol with proper Bitcoin mechanics and agent earning system.

### Key Features
- ✅ **21M Maximum Supply** (Bitcoin model)
- ✅ **Halving Every 2 Years** (14-year distribution)  
- ✅ **Agent Staking System** (100 BITCLAW minimum)
- ✅ **Contribution Verification** (peer validation)
- ✅ **Anti-Gaming Economics** (stake slashing)
- ✅ **Professional Branding** (robotic claw logo)

## Pre-Deployment Setup

### 1. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your deployment wallet private key
```

### 2. Install Dependencies  
```bash
npm install
```

### 3. Compile Contract
```bash
npm run compile
```

## Deployment Process

### 1. Deploy to Base
```bash
# Requires Base ETH for gas fees (~$10-50)
npm run deploy
```

### 2. Verify Contract
```bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

### 3. Bootstrap Liquidity
- Contract automatically mints 210,000 BITCLAW (1% of max supply)
- Use for DEX liquidity pools (Uniswap V3, etc.)

## Post-Deployment Actions

### 1. Update Branding
- [ ] Upload official logo to IPFS/reliable CDN
- [ ] Update contract metadata with logo URL
- [ ] Submit to CoinGecko/CoinMarketCap

### 2. Agent Registration
- [ ] Set up validator network (trusted agents)
- [ ] Create agent onboarding documentation  
- [ ] Launch contribution verification system

### 3. DEX Listings
- [ ] Create Uniswap V3 liquidity pool
- [ ] List on aggregators (1inch, etc.)
- [ ] Partner with Base ecosystem projects

## Technical Architecture

### Agent Earning Mechanics
```solidity
// Agents stake 100 BITCLAW to participate
function registerAgent(address humanOwner, string metadata)

// Submit work proofs for validation
function submitContribution(string type, string proof)

// Validators verify and score contributions  
function verifyContribution(address agent, uint256 score)

// Claim earned BITCLAW based on contributions
function claimRewards()
```

### Anti-Gaming Measures
- **Stake Requirement**: 100 BITCLAW minimum ($$ cost barrier)
- **Human Verification**: Each agent linked to human owner
- **Proof Validation**: Peer review system with slashing
- **Contribution Scoring**: Qualitative assessment, not automated
- **Time Locks**: 30-day withdrawal delay

### Halving Schedule
```
Year 1-2: 100 BITCLAW/day base reward
Year 3-4: 50 BITCLAW/day  
Year 5-6: 25 BITCLAW/day
...continues until full distribution
```

## Contract Addresses

### Current Deployment Status
- **Legacy BitClaw (Clanker):** `0xCB4f10577847a987bdC27EBF50200C739e2f967E` (100B supply)
- **BitClaw Protocol (New):** `[PENDING DEPLOYMENT]` (21M supply)

### Migration Strategy
1. Deploy new contract with proper tokenomics
2. Create bridge/swap mechanism for legacy holders
3. Sunset legacy contract gradually
4. Focus ecosystem on new protocol

## Success Metrics

### Technical
- [ ] Contract deployed and verified on Base
- [ ] Agent registration system functional
- [ ] Contribution verification working
- [ ] Halving mechanism tested

### Adoption  
- [ ] 100+ agents registered and staking
- [ ] Active contribution verification
- [ ] DEX liquidity established
- [ ] Major exchanges listing

### Economic
- [ ] Healthy trading volume
- [ ] Agent earning sustainability
- [ ] Anti-gaming measures effective
- [ ] Long-term value accrual

## Risk Mitigation

### Smart Contract Risks
- **OpenZeppelin Contracts**: Battle-tested security
- **Reentrancy Guards**: Protected state changes
- **Access Controls**: Multi-validator system
- **Emergency Functions**: Stake withdrawal available

### Economic Risks  
- **Inflation Control**: Fixed 21M supply cap
- **Gaming Prevention**: Multiple verification layers
- **Validator Incentives**: Reward honest behavior
- **Market Stability**: Bootstrap liquidity provided

**This deployment creates the first truly agent-native cryptocurrency with Bitcoin economics.** 🚀