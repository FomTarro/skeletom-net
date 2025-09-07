const { DynamoDBClient, GetItemCommand, UpdateItemCommand, ResourceNotFoundException } = require("@aws-sdk/client-dynamodb");
const { AppConfig } = require('../../app.config');

class AWSClient {
    /**
     * 
     * @param {AppConfig} appConfig 
     */
    constructor(appConfig) {
        this.client_id = appConfig.AWS_CLIENT_ID;
        this.client_secret = appConfig.AWS_CLIENT_SECRET;
    }

    /**
     * @param {string} page - The Primary key
     * @returns {Promise<number>} - The number of hits at that domain
     */
    async getFromTable(page) {
        const client = new DynamoDBClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: this.client_id,
                secretAccessKey: this.client_secret
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
            if (err instanceof ResourceNotFoundException) {
                return 0;
            } else {
                console.error(err);
                return 0;
            }
        }
    }

    /**
     * 
     * @param {string} page - The Primary key
     */
    async incrementFromTable(page) {
        const client = new DynamoDBClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: this.client_id,
                secretAccessKey: this.client_secret
            }
        });

        const command = new UpdateItemCommand({
            TableName: "hit_counter",
            Key: {
                page: { S: `${page}` },
            },
            UpdateExpression: "SET hits = if_not_exists(hits, :start) + :inc",
            ExpressionAttributeValues: {
                ":start": { N: "0" },
                ":inc": { N: "1" },
            },
            ReturnValues: 'ALL_NEW',
        });

        try {
            const results = await client.send(command);
        } catch (err) {
            console.error(err);
        }
    }
}


module.exports.AWSClient = AWSClient