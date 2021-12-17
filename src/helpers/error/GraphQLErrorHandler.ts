import { NotFound } from "@tsed/exceptions";

export default class GraphQlErrorHandler{ 
    static determineError(response: any, arrayStrict: boolean = false): any { 
        if (response.errors) {
            if (response.errors.foreach((msg: string) => msg.includes("Cast to ObjectId"))) {
                throw new NotFound("Item could not be found")
            }
        } else { 
            
        }
    }
}
