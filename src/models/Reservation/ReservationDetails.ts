import { Minimum, Property, Required } from "@tsed/schema";

export class ObjectDetails {
    @Minimum(0)
    @Property()
    id: number;

    @Property()
    name: string;
}


export default class ReservationDetails {
    @Property()
    building: ObjectDetails;

    @Property()
    room: ObjectDetails;

    @Property()
    desk?: ObjectDetails;
}
