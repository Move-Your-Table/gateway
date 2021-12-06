import {Minimum, Property, string} from "@tsed/schema";

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
  startTime: Date;

  @Property()
  endTime: Date
}
