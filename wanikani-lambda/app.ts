import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getLevels } from './get-levels';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    let queryParams = event.queryStringParameters;

        let levels:Array<number> = await getLevels();
    
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: `hi ${queryParams}`,
                test: queryParams,
                type: event.httpMethod,
                levels: levels
            }),
        };
    return response;
};
