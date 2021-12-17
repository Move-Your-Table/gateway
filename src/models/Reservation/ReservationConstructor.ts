import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Required()
    userId: string;

    @Property()
    @Required()
    buildingId: string;

    @Property()
    @Required()
    roomName: string;

    @Property()
    @Required()
    deskName: string;

    @Property()
    @Required()
    startTime: Date;

    @Property()
    @Required()
    endTime: Date
}
