/*
* Explanation:
* Partitioned input domain into blocks.
* For each of the blocks, if the function returns a trivial value it does so immediately.
* If input types determine return values, grouped them into common control flow branches.
* Factored out digest computation into a function.
* Reduced the scope of the helper variable `candidate`.
*
* */
const crypto = require("crypto");

const hexDigest = (obj) => {
  return crypto.createHash("sha3-512").update(obj).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY
  }

  if (!event.partitionKey) {
    return hexDigest(JSON.stringify(event))
  }

  if (typeof event.partitionKey === "string") {
    if (event.partitionKey.length <= MAX_PARTITION_KEY_LENGTH) {
      return event.partitionKey
    } else {
      return hexDigest(event.partitionKey)
    }
  } else {
    const candidate = JSON.stringify(event.partitionKey)
    if( candidate.length <= MAX_PARTITION_KEY_LENGTH){
      return candidate
    } else {
      return hexDigest(candidate)
    }
  }

};

