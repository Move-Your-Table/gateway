import {MaxLength, MinLength, Required} from "@tsed/schema";
import BuildingLocation from "./BuildingLocation";

export default class BuildingConstructor extends BuildingLocation{
  @Required()
  @MinLength(2)
  @MaxLength(60)
  name: string;
}
