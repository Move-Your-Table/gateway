import { Minimum, Property, Required} from "@tsed/schema";
import Person from "../Person";

export default class IncidentReport {
  @Property()
  @Required()
  @Minimum(0)
  id: number;

  @Property()
  @Required()
  message: string;

  @Property()
  @Minimum(0)
  user: Person;
}
