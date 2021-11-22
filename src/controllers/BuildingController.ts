import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import Building from "src/models/Building";

@Controller("/buildings")
export class BuildingController {
  @Get()
  findAll(): Array<Building> {
    const json: Array<Building> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        name: `Building Name ${i}`,
        street: `Street Name ${i}`,
        city: `City ${i}`,
        postcode:  9000 + i,
        rooms: {
          total: 100 + i,
          free: 50 + i
        },
        desks: {
          total: 100 + i,
          free: 50 + i
        }
      };
      json.push(element);
    }
    return json;
  }
}
