import { Minimum, Property  } from "@tsed/schema";

export class ObjectDetails {
    @Property()
    id: string;

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
