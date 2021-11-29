import {Minimum, Property} from "@tsed/schema";

export default class Person {
  @Property()
  @Minimum(0)
  id: number;

  @Property()
  first_name: string;

  @Property()
  last_name: string;

  @Property()
  company: string;
}
