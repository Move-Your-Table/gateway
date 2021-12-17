import {Minimum, Property, Required} from "@tsed/schema";
import BuildingConstructor from "./BuildingConstructor";

export default class Building extends BuildingConstructor {
  @Required()
  id: string;
}
