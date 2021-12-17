import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Required()
    buildingId: string;

    @Property()
    @Required()
    roomId: string;

    @Property()
    deskId?: string;

    @Property()
    @Required()
    startTime: Date;

    @Property()
    @Required()
    endTime: Date
}
