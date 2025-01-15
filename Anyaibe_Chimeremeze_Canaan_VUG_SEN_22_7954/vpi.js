const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Blockchain = require("./blockChain");
const uuid = require("uuid");

const app = express();
const anyaibeChimeremezeCanaan = new Blockchain();
const nodeAddress = uuid.v1().split("-").join("");

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/blockchain", (req, res) => {
    res.send(anyaibeChimeremezeCanaan);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/transaction", (req, res) => {
    const { amount, sender, recipient } = req.body;
    const blockIndex = anyaibeChimeremezeCanaan.createNewTransaction(amount, sender, recipient);
    res.send(`Transaction added to block ${blockIndex}. Amount: ${amount}, Sender: ${sender}, Recipient: ${recipient}`);
});

app.get('/mine', (req, res) => {
    const lastBlock = anyaibeChimeremezeCanaan.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: anyaibeChimeremezeCanaan.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = anyaibeChimeremezeCanaan.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = anyaibeChimeremezeCanaan.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = anyaibeChimeremezeCanaan.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        message: 'New block mined successfully!',
        block: newBlock
    });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
