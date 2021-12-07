import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Minimum(0)
    buildingId: number;

    @Property()
    @Minimum(0)
    roomId: number;

    @Property()
    @Minimum(0)
    deskId?: number;

    @Property()
    startTime: Date;

    @Property()
    endTime: Date
}
