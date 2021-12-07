import { Controller } from "@tsed/di";
import { PathParams } from "@tsed/platform-params";
import { Get, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Building from "src/models/Building/Building";

@Controller("/buildings")
@Tags("Buildings")
@Docs("admin-api", "general-api")
export class BuildingController {
  @Get()
  @Summary("Get all buildings")
  @(Returns(200, Array).Of(Building))
  findAll(): Array<Building> {
    const json: Array<Building> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        name: `Building Name ${i}`,
        street: `Street Name ${i}`,
        city: `City ${i}`,
        country: "Belgium",
        postcode: "9000E",
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
  @Summary("Get 🔑-identified building")
  @Returns(200, Building)
  @(Returns(404).Description("Not Found"))
  getById(@PathParams("id") id: number): Building {
    return {
      id: id,
      name: `The Spire ${id}`,
      street: `Spire Street ${id}`,
      city: `City ${id}`,
      postcode: "9000",
      country: "Belgium",
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
