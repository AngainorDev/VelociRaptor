# VelociRaptor

Hierarchical Deterministic wallet for Raptoreum Crypto currency.

Full JS Version.


## Overview

- Generate any amount of keys from a single BIP39 mnemonic  
- Convert any seed into a BIP39 mnemonic (paperCode) and back.
- conforms to BIP44 

Auto build Github pages version: [https://angainordev.github.io/VelociRaptor/js/dist/index.html](https://angainordev.github.io/VelociRaptor/js/dist/index.html) 


## Derivation mechanism

BIP 39 - BIP44 - SLIP-0044

Coin type 200 was first used.  
Coin type xxx Will be added when registered.

Custom derivation path of `m/0'/2'/n` was added to follow Stacy's Bot implementation. 


## Paper codes

Paper codes allow to regenerate individual wallets without the master word pass.

## Tests 

WIP - left over from previous work, to be done later on.

## Changelog

- v0.2: Added new BIP44 chain code 10226, set BIP 44 as default derivation scheme 
- v0.1: Initial commit, fully functional, coin type 200 and Stacy's scheme.

## Donation address

Donations will help us maintain and improve this tool and other ones

RTM Address  
`RMQtyqvSphSGyD5cNN8s5AiBqCQTqsS2HM`  
![](https://github.com/AngainorDev/VelociRaptor/raw/main/angainor-rtm.png)

