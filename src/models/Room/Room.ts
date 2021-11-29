import {Minimum, Property, Required} from "@tsed/schema";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import RoomConstructor from "./RoomConstructor";

export default class Room extends RoomConstructor {
  @Property()
  @Required()
  @Minimum(0)
  id: number;

  @Property()
  @Minimum(0)
  incidents: number;

  @Property(MaskedReservation || Reservation)
  reservations: Array<MaskedReservation> | Array<Reservation>;
}
