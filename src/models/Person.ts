import {Minimum, Property} from "@tsed/schema";

export default class Person {
  @Property()
  id: string;

  @Property()
  first_name: string;

  @Property()
  last_name: string;

  @Property()
  company: string;
}
