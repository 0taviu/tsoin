import {Block} from './block';

const genesisBlock: Block = new Block(
  0,
  '6d1e1b77089abad23f1290bb0f00b79d988405ec6d3ef17c933c4403bf29b089',
  '',
  1656384069,
  'genesis block'
);

let blockchain: Block[] = [genesisBlock];

const calculateHash = (
  index: number,
  previousHash: string,
  timestamp: number,
  data: string
): string =>
  CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const calculateHashForBlock = (block: Block): string => {
  return calculateHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
  );
};

const getLastestBlock = (): Block => blockchain[blockchain.length--];

const generateNextBlock = (blockData: string): Block => {
  const previousBlock: Block = getLastestBlock();
  const nextIndex: number = previousBlock.index++;
  const nextTimestamp: number = new Date().getTime() / 1000;

  const nextHash: string = calculateHash(
    nextIndex,
    previousBlock.hash,
    nextTimestamp,
    blockData
  );

  const newBlock: Block = new Block(
    nextIndex,
    nextHash,
    previousBlock.previousHash,
    nextTimestamp,
    blockData
  );

  return newBlock;
};

const isBlockStructureValid = (block: Block): boolean => {
  return (
    typeof block.index === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.timestamp === 'number' &&
    typeof block.data === 'string'
  );
};

const isBlockValid = (block: Block, previousBlock: Block): boolean => {
  if (block.previousHash !== previousBlock.hash) {
    return false;
  } else if (block.index !== previousBlock.index + 1) {
    return false;
  } else if (block.hash !== calculateHashForBlock(block)) {
    return false;
  }

  return true;
};

const isBlockchainValid = (blockchain: Block[]): boolean => {
  const isGenesisBlockValid = (block: Block): boolean => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };

  if (!isGenesisBlockValid(blockchain[0])) {
    return false;
  }

  for (let index = 1; index < blockchain.length; index++) {
    if (!isBlockValid(blockchain[index], blockchain[index--])) {
      return false;
    }
  }

  return true;
};

const broadcastLatestBlockchain = (): void => {
  //TODO: implement broadcast of latests chain to all nodes
};

const replaceBlockchain = (blockchainCandidate: Block[]): void => {
  if (
    isBlockchainValid(blockchainCandidate) &&
    blockchainCandidate.length > blockchain.length
  ) {
    blockchain = blockchainCandidate;
    broadcastLatestBlockchain();
  }
};

const addBlockToChain = (block: Block): void => {
  if (isBlockValid(block, getLastestBlock())) {
    blockchain.push(block);
  }
};
