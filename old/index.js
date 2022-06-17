const nacl = require('tweetnacl');
const { getLevels } = require('./get-levels');

exports.handler = async (event) => {
  // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp'];
  const strBody = event.body; // should be string, for successful sign

  // https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization
  // nacl.sign.detached.verify(message, signature, publicKey)
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  );

  if (!isVerified) {
    return {
      statusCode: 401,
      body: JSON.stringify('invalid request signature'),
    };
  }

  // PING response 
  // https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
  const body = JSON.parse(strBody)
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ "type": levels[0] }),
    }
  }

  if (body.data.name == 'foo') {
    return JSON.stringify({  // Note the absence of statusCode
      "type": 4,  // This type stands for answer with invocation shown
      "data": { "content": "bar" }
    })
  }

  if (body.data.name == 'getLevelUps') {
    const levels = await getLevels();
    return JSON.stringify({  // Note the absence of statusCode
      "type": 4,  // This type stands for answer with invocation shown
      "data": { "content": levels }
    })
  } 

  // https://discord.com/developers/docs/intro 
  // https://betterprogramming.pub/build-a-discord-bot-with-aws-lambda-api-gateway-cc1cff750292
};