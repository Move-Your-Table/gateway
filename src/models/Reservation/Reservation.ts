import {Property} from "@tsed/schema";
import Person from "../Person";
import MaskedReservation from "./MaskedReservation";

export default class Reservation extends MaskedReservation {
  @Property()
  reserved_for: Person;
}
