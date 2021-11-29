import {CollectionOf, Generics, Minimum, Property, Required} from "@tsed/schema";
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
  @Minimum(0)
  incidents: number;

  @Property(MaskedReservation || Reservation)
  @CollectionOf("T")
  reservations: Array<T>;
}
