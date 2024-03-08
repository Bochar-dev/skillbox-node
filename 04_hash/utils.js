const { createHash } = require("crypto");
const axios = require("axios");
const fs = require("fs/promises");

const sha256 = (buffer) => {
  const hash = createHash("sha256");

  hash.update(buffer);

  return hash.digest("hex");
};

const compareHashes = (hashA, hashB) => {
  return hashA.toString("hex") === hashB.toString("hex");
};

const getHashesFromURL = async (filePath, hashFilePath) => {
  let hashA = "";
  let hashB = "";

  try {
    const { data: file } = await axios.get(filePath);
    const buffer = Buffer.from(file);
    hashA = sha256(buffer);
  } catch (err) {
    console.error("Ошибка чтения исходного файла");
    process.exit(100);
  }

  try {
    const { data: hashFile } = await axios.get(hashFilePath);
    hashB = hashFile.trim();
  } catch (err) {
    console.error("Ошибка чтения хеш-файла");
    process.exit(101);
  }

  return {
    hashA,
    hashB,
  };
};

const getHashesFromPath = async (filePath, hashFilePath) => {
  let hashA = "";
  let hashB = "";

  try {
    const buffer = await fs.readFile(filePath);
    hashA = sha256(buffer);
  } catch (err) {
    console.error("Ошибка чтения исходного файла");
    process.exit(100);
  }

  try {
    const data = await fs.readFile(hashFilePath, "utf8");
    hashB = data.trim();
  } catch (err) {
    console.error("Ошибка чтения хеш-файла");
    process.exit(101);
  }

  return {
    hashA,
    hashB,
  };
};

module.exports = { sha256, compareHashes, getHashesFromURL, getHashesFromPath };
