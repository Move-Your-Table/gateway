import { CollectionOf, Minimum, Property, Required } from "@tsed/schema";
import IncidentReport from "../IncidentReport/IncidentReport";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import DeskConstructor from "./DeskConstructor";

export default class Desk<T> extends DeskConstructor{
    @Property()
    @Required()
    @Minimum(0)
    id: number;

    @Property()
    @Required()
    @Minimum(0)
    buildingId: number;

    @Property()
    @Required()
    @Minimum(0)
    roomId: number;

    @Property()
    incidents?: Array<IncidentReport>;

    @Property(Reservation || MaskedReservation)
    @CollectionOf("T")
    reservations: T[];
}
