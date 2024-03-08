const { compareHashes, getHashesFromURL, getHashesFromPath } = require("./utils");

const filePath = process.argv[2];
const hashFilePath = `${filePath}.sha256`;

let isFileURL = false;

try {
  new URL(filePath);
  isFileURL = true;
} catch (err) {
  isFileURL = false;
}

(async () => {
  const { hashA, hashB } = isFileURL
    ? await getHashesFromURL(filePath, hashFilePath)
    : await getHashesFromPath(filePath, hashFilePath);

  if (!compareHashes(hashA, hashB)) {
    console.error("Хеши не совпадают");
    process.exit(102);
  }

  console.log("Хеши совпадают");
  process.exit(0);
})();
