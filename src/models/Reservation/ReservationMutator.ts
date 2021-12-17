import { Minimum, Property, Required } from "@tsed/schema";

export default class ReservationConstructor {
    @Property()
    buildingId: string;

    @Property()
    roomName: string;

    @Property()
    deskName?: string;

    @Property()
    startTime: Date;

    @Property()
    endTime: Date
}
