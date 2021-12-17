import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Required()
    buildingId: string;

    @Property()
    @Required()
    @Minimum(0)
    roomName: string;

    @Property()
    deskName?: string;

    @Property()
    @Required()
    startTime: Date;

    @Property()
    @Required()
    endTime: Date
}
