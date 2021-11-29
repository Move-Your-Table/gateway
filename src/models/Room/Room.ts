import {Minimum, Property, Required} from "@tsed/schema";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";

export default class Room {
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
  name: string;

  @Property()
  type: string;

  @Property()
  @Minimum(0)
  incidents: number;

  @Property()
  features: string;

  @Property(MaskedReservation || Reservation)
  reservations: Array<MaskedReservation> | Array<Reservation>;
}
