import {Minimum, Property} from "@tsed/schema";
import ReservationDetails from "./ReservationDetails";

export default class MaskedReservation extends ReservationDetails{
  @Property()
  @Minimum(0)
  id: number;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date
}
