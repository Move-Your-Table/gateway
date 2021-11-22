import {Controller} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
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
        postcode: 9000 + i,
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

  @Get("/:id")
  getById(@PathParams("id") id: number): Building {
    return {
      id: id,
      name: `The Spire ${id}`,
      street: `Spire Street ${id}`,
      city: `City ${id}`,
      postcode: 9000,
      rooms: {
        total: 100,
        free: 50
      },
      desks: {
        total: 100,
        free: 50
      }
    };
  }
}
