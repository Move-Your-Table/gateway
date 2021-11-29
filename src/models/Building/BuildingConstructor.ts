import {MaxLength, MinLength, Required} from "@tsed/schema";

export default class BuildingConstructor {
  @Required()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @Required()
  @MinLength(2)
  @MaxLength(60)
  street: string;

  @Required()
  @MinLength(2)
  city: string;

  @Required()
  @MinLength(2)
  postcode: string;
}
