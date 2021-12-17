import { Minimum, Property, Required } from "@tsed/schema";

export default class DeleteReservationConstructor {
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
    deskId: string;
}
