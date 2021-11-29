import {Property, Required, Minimum} from "@tsed/schema";

export default class RoomConstructor {
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
  features: string;
}
