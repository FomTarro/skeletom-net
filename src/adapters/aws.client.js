const { DynamoDBClient, GetItemCommand, UpdateItemCommand, ResourceNotFoundException } = require("@aws-sdk/client-dynamodb");
const { AppConfig } = require('../../app.config');

/**
 * @param {string} page - The Primary key
 * @param {AppConfig} appConfig 
 * @returns {number} - The number of hits at that domain
 */
async function getFromTable(page, appConfig){
    const client = new DynamoDBClient({ 
        region: "us-east-1",
        credentials: {
            accessKeyId: appConfig.AWS_CLIENT_ID,
            secretAccessKey: appConfig.AWS_CLIENT_SECRET
        }
    });
    
    const command = new GetItemCommand({
        TableName: "hit_counter",
        Key: {
          page: { S: `${page}` },
        },
      });
    try {
        const results = await client.send(command);
        return results.Item.hits.N;
    } catch (err) {
        if(err instanceof ResourceNotFoundException){
            return 0;
        }else{
            console.error(err);
            return 0;
        }
    }
}

/**
 * 
 * @param {string} page - The Primary key
 * @param {AppConfig} appConfig 
 */
async function incrementFromTable(page, appConfig){
    const client = new DynamoDBClient({ 
        region: "us-east-1",
        credentials: {
            accessKeyId: appConfig.AWS_CLIENT_ID,
            secretAccessKey: appConfig.AWS_CLIENT_SECRET
        }
    });

    const command = new UpdateItemCommand({
        TableName: "hit_counter",
        Key: {
            page: { S: `${page}` },
        },
        UpdateExpression: "SET hits = if_not_exists(hits, :start) + :inc",
        ExpressionAttributeValues: {
            ":start": {N: "0"},
            ":inc": {N: "1"},
        },
        ReturnValues: 'ALL_NEW',
      });
    
    try {
        const results = await client.send(command);
    } catch (err) {
        console.error(err);
    }
}

module.exports.GetFromTable = getFromTable;
module.exports.IncrementFromTable = incrementFromTable;