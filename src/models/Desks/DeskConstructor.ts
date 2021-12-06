import { Property, Required, Minimum } from "@tsed/schema";

export default class DeskConstructor {
    @Property()
    @Required()
    name: string;

    @Property()
    @Required()
    type: string;

    @Property()
    @Required()
    features: string;

    @Property()
    @Minimum(1)
    @Required()
    capacity: number;

    @Property()
    @Required()
    floor: number;
}
