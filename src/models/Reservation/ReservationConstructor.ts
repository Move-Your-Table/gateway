import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Required()
    @Minimum(0)
    buildingId: number;

    @Property()
    @Required()
    @Minimum(0)
    roomId: number;

    @Property()
    @Minimum(0)
    deskId?: number;

    @Property()
    @Required()
    startTime: Date;

    @Property()
    @Required()
    endTime: Date
}
