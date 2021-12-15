import { CollectionOf, Minimum, Property, Required } from "@tsed/schema";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import DeskConstructor from "./DeskConstructor";

export default class Desk<T> extends DeskConstructor{
    @Property()
    @Required()
    @Minimum(0)
    id: string;

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
    incidents: number;

    @Property(Reservation || MaskedReservation)
    @CollectionOf("T")
    reservations: T[];
}
