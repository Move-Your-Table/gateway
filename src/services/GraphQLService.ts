import { GraphQLClient, RequestDocument } from 'graphql-request'

const client = new GraphQLClient(`http://${process.env.BACK_END_ENDPOINT}:${process.env.BACK_END_PORT}/graphql` || "");

export default class GraphQLService {
    static async request(query : RequestDocument, variables : Object = {}) : Promise<any> {
        return await client.request(query, variables);
    }
}