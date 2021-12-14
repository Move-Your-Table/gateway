import { GraphQLClient, RequestDocument } from 'graphql-request'

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "");

export default class GraphQLService {
    static async request(query : RequestDocument, variables : Object = {}) : Promise<any> {
        return await client.request(query, variables);
    }
}