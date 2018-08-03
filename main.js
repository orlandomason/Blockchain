const SHA256 = require("crypto-js/SHA256");

class Transaction {

	constructor(from_address, to_address, amount) {
		this.from_address = from_address;
		this.to_address = to_address;
		this.amount = amount;
	}
}

class Block {

	constructor(timestamp, transactions, previous_hash = "") {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previous_hash = previous_hash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.previous_hash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
	}
}

class Blockchain {

	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 3;
		this.pending_transactions = [];
		this.mining_reward = 100;
	}

	createGenesisBlock() {
		return new Block(0, "03/08/2018", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	createTransaction(transaction) {
		this.pending_transactions.push(transaction);
	}

	minePendingTransactions(mining_reward_address) {
		let block = new Block(Date.now(), this.pending_transactions);
		block.mineBlock(this.difficulty);

		this.chain.push(block);
		this.pending_transactions = [
			new Transaction(null, mining_reward_address, 100)
		];
	}

	getBalanceOfAddress(address) {
		let balance = 0;

		for(const block of this.chain) {
			for(const trans of block.transactions) {
				if (trans.to_address === address) {
					balance += trans.amount;
				}
				if (trans.from_address === address) {
					balance -= trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid() {
		for(let i = 1; i < this.chain.length; i++) {
			const current_block = this.chain[i];
			const previous_block = this.chain[i - 1];

			if (current_block.hash !== current_block.calculateHash()) {
				return false;
			}

			if (current_block.previous_hash !== previous_block.hash) {
				return false;
			}
		}
		return true;
	}
}

let demo_coin = new Blockchain();

demo_coin.createTransaction(new Transaction("address1", "address2", 125));
demo_coin.createTransaction(new Transaction("address2", "address1", 67));

demo_coin.minePendingTransactions("address1");
demo_coin.minePendingTransactions("address2");

console.log("address1: " + demo_coin.getBalanceOfAddress("address1"));
console.log("address2: " + demo_coin.getBalanceOfAddress("address2"));