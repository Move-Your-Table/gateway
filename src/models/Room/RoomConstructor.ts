import { Property, Required, Minimum, Example } from "@tsed/schema";

export default class RoomConstructor {
  @Property()
  @Required()
  roomName: string;

  @Property()
  @Required()
  type: string;

  @Property()
  @Required()
  @Example(["Fridge"])
  features: Array<String>;

  @Property()
  @Minimum(1)
  @Required()
  capacity: number;

  @Property()
  @Required()
  floor: number;
}
