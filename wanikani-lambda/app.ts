import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getLevels } from './get-levels';
import nacl from 'tweetnacl';
import { resolve } from 'path';
import { AnyRecord } from 'dns';
//axios global setting


/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

interface DiscordAPIGatewayProxyEvent extends APIGatewayProxyEvent {
    headers: {
        'x-signature-ed25519': string,
        'x-signature-timestamp': string
    }
}

interface DiscordInteractionBodyData {
  data: {
    "guild_id"?: string,
    "id"?: string,
    "name"?: string,
    "type"? : number,
    "data": string,
  }
  type?: number,
}

let corsHeaders = {
  "Access-Control-Allow-Headers" :  "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods" : "POST,GET,OPTIONS",
}


export const lambdaHandler = async (event: DiscordAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    let queryParams = event.queryStringParameters;



    // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal

  const PUBLIC_KEY: string = process.env.PUBLIC_KEY;
  const signature: string = event.headers['x-signature-ed25519']
  const timestamp: string = event.headers['x-signature-timestamp'];
  const strBody: string = event.body ? event.body: '{}'; // should be string, for successful sign

  if(event.httpMethod === "OPTIONS"){
    return {
      headers: corsHeaders,
      statusCode: 204,
      body: JSON.stringify('invalid request signature'),
    };
  }

  // https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization
  // nacl.sign.detached.verify(message, signature, publicKey)
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex')
  );

  if (!isVerified) {
    return {
      headers: corsHeaders,
      statusCode: 401,
      body: JSON.stringify('invalid request signature'),
    };
  }

  // PING response 
  // https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
  const body: DiscordInteractionBodyData = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      headers: corsHeaders,
      statusCode: 200,
      body: JSON.stringify({ "type": 1 }),
    }
  }

  if (body?.data?.name == 'foo') {
    console.log(strBody);
    let levels = await getLevels();
    console.log('levels api req complete');

    // return JSON.stringify({  // Note the absence of statusCode
    //   "type": 4,  // This type stands for answer with invocation shown
    //   "data": { "content": "bar" }
    // })
    // response = Buffer.from(JSON.stringify({  // Note the absence of statusCode
    //   "type": 4,  // This type stands for answer with invocation shown
    //   "data": { "content": "bar" }
    // }));
    response = {statusCode: 200, body: JSON.stringify({ type: 4, data: {content: "bar"} })};
    console.log(response);
    return response;
  }

  return response = {
    headers: corsHeaders,
    statusCode: 200,
    body: JSON.stringify({
        message: "no command found"
    }),
};
};
