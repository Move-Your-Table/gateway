import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    @Minimum(0)
    buildingId: string;

    @Property()
    @Minimum(0)
    roomId: string;

    @Property()
    @Minimum(0)
    deskId?: string;

    @Property()
    startTime: Date;

    @Property()
    endTime: Date
}
