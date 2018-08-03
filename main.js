const SHA256 = require("crypto-js/SHA256");

class Block {

	constructor(timestamp, data, previous_hash = "") {
		this.timestamp = timestamp;
		this.data = data;
		this.previous_hash = previous_hash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.previous_hash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
	}

	createGenesisBlock() {
		return new Block(0, "03/08/2018", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(new_block) {
		new_block.previous_hash = this.getLatestBlock().hash;
		new_block.mineBlock(this.difficulty);
		this.chain.push(new_block);
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

demo_coin.addBlock(new Block("04/08/2018", {amount: 4}));
demo_coin.addBlock(new Block("07/08/2018", {amount: 9}));

//demo_coin.chain[2].data = {amount: 20};

console.log(JSON.stringify(demo_coin, null, 4));
console.log(demo_coin.isChainValid());