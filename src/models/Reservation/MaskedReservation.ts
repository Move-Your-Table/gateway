import {Minimum, Property} from "@tsed/schema";
import ReservationDetails from "./ReservationDetails";

export default class MaskedReservation extends ReservationDetails{
  @Property()
  id: string;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date
}
