import {Minimum, Property} from "@tsed/schema";
import ReservationConstructor from "./ReservationConstructor";

export default class MaskedReservation extends ReservationConstructor{
  @Property()
  @Minimum(0)
  id: number;
}
