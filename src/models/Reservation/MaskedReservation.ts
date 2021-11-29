import {Minimum, Property} from "@tsed/schema";

export default class MaskedReservation {
  @Property()
  @Minimum(0)
  id: number;

  @Property()
  @Minimum(0)
  roomId: number;

  @Property()
  @Minimum(0)
  deskId?: number;

  @Property()
  dateTime: Date;
}
