import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Required()
    @Minimum(0)
    userId: string;

    @Property()
    @Required()
    @Minimum(0)
    buildingId: string;

    @Property()
    @Required()
    @Minimum(0)
    roomId: string;

    @Property()
    @Minimum(0)
    deskId?: string;

    @Property()
    @Required()
    startTime: Date;

    @Property()
    @Required()
    endTime: Date
}
