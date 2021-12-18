import { Minimum, Property, Required } from "@tsed/schema";

export default class DeleteReservationConstructor {
    @Property()
    @Required()
    buildingId: string;

    @Property()
    @Required()
    roomName: string;

    @Property()
    @Required()
    deskName: string;
}
