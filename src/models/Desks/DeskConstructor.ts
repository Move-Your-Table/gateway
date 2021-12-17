import { Property, Required, Minimum, Example } from "@tsed/schema";

export default class DeskConstructor {
    @Property()
    @Required()
    deskName: string;

    @Property()
    @Required()
    type: string;

    @Property()
    @Required()
    @Example([])
    features: Array<string>;

    @Property()
    @Minimum(1)
    @Required()
    capacity: number;

    @Property()
    @Required()
    floor: number;
}
