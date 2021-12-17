import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    buildingId: string;

    @Property()
    roomId: string;

    @Property()
    deskId?: string;

    @Property()
    startTime: Date;

    @Property()
    endTime: Date
}
