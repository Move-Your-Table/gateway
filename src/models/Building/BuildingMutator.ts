import {MaxLength, MinLength, Nullable, Property} from "@tsed/schema";

export default class BuildingMutator {
  @Property()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @Property()
  @MinLength(2)
  @MaxLength(60)
  street: string;

  @Property()
  @Nullable(String)
  @MinLength(2)
  city: string;

  @Property()
  @Nullable(String)
  @MinLength(2)
  postcode: string;

  @Property()
  @Nullable(String)
  @MinLength(2)
  country: string;
}
