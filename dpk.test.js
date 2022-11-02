const {deterministicPartitionKey} = require("./dpk");
const crypto = require('crypto');

describe("deterministicPartitionKey", () => {
  const stringifyAndHash = (obj) => {
    const data = JSON.stringify(obj);
    return crypto.createHash("sha3-512").update(data).digest("hex");
  }
  const makeHash = (obj) => {
    return crypto.createHash("sha3-512").update(obj).digest("hex");
  }

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns hash of stringified event when event.partitionKey is a string of length 0", () => {
    const event = {
      partitionKey: ""
    }
    expect(deterministicPartitionKey(event)).toBe(stringifyAndHash(event))
  })

  it("Returns hash of stringified event when event.partitionKey is falsy", () => {
    const event = {
      partitionKey: false
    }
    expect(deterministicPartitionKey(event)).toBe(stringifyAndHash(event))
  })

  it("Returns hash of stringified event when event is empty object", () => {
    const event = {}
    expect(deterministicPartitionKey(event)).toBe(stringifyAndHash(event))
  })

  it("Returns hash of stringified event when event doesn't contain partitionKey field", () => {
    const event = {
      other: [1, 2]
    }
    expect(deterministicPartitionKey(event)).toBe(stringifyAndHash(event))
  })

  it("Returns event.partitionKey when event.partitionKey is a string of length<256", () => {
    const event = {
      partitionKey: "s".repeat(255)
    }
    expect(deterministicPartitionKey(event)).toBe(event.partitionKey)
  })

  it("Returns event.partitionKey when event.partitionKey is a string of length==256", () => {
    const event = {
      partitionKey: "s".repeat(256)
    }
    expect(deterministicPartitionKey(event)).toBe(event.partitionKey)
  })

  it("Returns hash of event.partitionKey when event.partitionKey is a string of length>256", () => {
    const event = {
      partitionKey: "s".repeat(257)
    }
    expect(deterministicPartitionKey(event)).toBe(makeHash(event.partitionKey))
  })

  it("Returns strignified event.partitionKey when event.partitionKey is not a string and truthy and its length<256", () => {
    const event = {
      partitionKey: []
    }
    expect(deterministicPartitionKey(event)).toBe(JSON.stringify(event.partitionKey))
  })

  it("Returns strignified event.partitionKey when event.partitionKey is not a string and truthy and its length==256", () => {
    const str = "s".repeat(252)
    const event = {
      partitionKey: [str]
    }
    // console.log(JSON.stringify(event.partitionKey).length)
    expect(deterministicPartitionKey(event)).toBe(JSON.stringify(event.partitionKey))
  })
/**
 * unnecessary branch
 * */
  it("Returns strignified event.partitionKey when event.partitionKey is not a string and truthy and its length>256", () => {
    const str = "s".repeat(253)
    const event = {
      partitionKey: [str]
    }
    // console.log(JSON.stringify(event.partitionKey).length)
    expect(deterministicPartitionKey(event)).toBe(stringifyAndHash(event.partitionKey))
  })
});
