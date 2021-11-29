import {Minimum, Property, Required} from "@tsed/schema";
import BuildingConstructor from "./BuildingConstructor";

export class Rooms {
  @Required()
  @Minimum(0)
  total: number;

  @Required()
  @Minimum(0)
  free: number;
}

export class Desks {
  @Required()
  @Minimum(0)
  total: number;

  @Required()
  @Minimum(0)
  free: number;
}

export default class Building extends BuildingConstructor {
  @Required()
  @Minimum(0)
  id: number;

  @Property(Rooms)
  rooms: Rooms;

  @Property(Desks)
  desks: Desks;
}
