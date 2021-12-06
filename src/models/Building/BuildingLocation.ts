import { MaxLength, MinLength, Property, Required } from "@tsed/schema";

export default class BuildingLocation {
    @Property()
    @Required()
    @MinLength(2)
    @MaxLength(60)
    street: string;

    @Property()
    @Required()
    @MinLength(2)
    city: string;

    @Property()
    @Required()
    @MinLength(2)
    postcode: string;

    @Property()
    @Required()
    @MinLength(2)
    country: string;
}
