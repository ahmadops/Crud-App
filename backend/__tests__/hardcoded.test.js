const fs = require('fs');
const path = require('path');

test('MongoDB URI must NOT be hardcoded in server.js', () => {
  const serverPath = path.join(__dirname, '..', 'server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');

  // Regex to detect mongodb connection string
  const hardcodedMongoRegex = /mongodb(\+srv)?:\/\/.+/i;

  const usesEnvVariable =
    serverCode.includes('process.env.MONGO_URI');

  const hasHardcodedMongo =
    hardcodedMongoRegex.test(serverCode) && !usesEnvVariable;

  // ❌ Fail if hardcoded
  expect(hasHardcodedMongo).toBe(false);
});
