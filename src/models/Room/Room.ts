import {CollectionOf, Generics, Minimum, Property, Required} from "@tsed/schema";
import IncidentReport from "../IncidentReport/IncidentReport";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import RoomConstructor from "./RoomConstructor";

@Generics("T")
export default class Room<T> extends RoomConstructor {
  @Property()
  @Required()
  @Minimum(0)
  id: number;

  @Property()
  @Required()
  @Minimum(0)
  buildingId: number;

  @Property()
  incidents?: Array<IncidentReport>;

  @Property(Reservation || MaskedReservation)
  @CollectionOf("T")
  reservations: T[];
}
