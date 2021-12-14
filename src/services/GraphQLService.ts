import { GraphQLClient, RequestDocument } from 'graphql-request'

export class GraphQLService {
    client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT || "");

    async request(query : RequestDocument, variables : Object = {}) {
        return await this.client.request(query, variables);
    }
}