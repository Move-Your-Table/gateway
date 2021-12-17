import { Controller } from "@tsed/di";
import { PathParams } from "@tsed/platform-params";
import { Get, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import GraphQLService from "../services/GraphQLService";
import Building from "../models/Building/Building";
import BuildingMapper from "../models/Building/BuildingMapper";

@Controller("/buildings")
@Tags("Buildings")
@Docs("admin-api", "general-api")
export class BuildingController {
  @Get()
  @Summary("Get all buildings")
  @(Returns(200, Array).Of(Building))
  async findAll(): Promise<Array<Building>> {
    const query = gql`
    query {
      buildings {
        _id
        name
        address {
          street
          city
          postalcode
          country
        }
      }
    }
    `

    const result = await GraphQLService.request(query);
    const buildings = result.buildings as Array<any>;
    return buildings.map(BuildingMapper.mapBuilding);
  }

  @Get("/:id")
  @Summary("Get 🔑-identified building")
  @Returns(200, Building)
  @(Returns(404).Description("Not Found"))
  async getById(@PathParams("id") id: string): Promise<Building> {
    const query = gql`
    query getSpecificBuilding($id: String!) {
      building(id: $id) {
        _id
        name
        address {
          street
          city
          postalcode
          country
        }
      }
    }
    `
    const result = await GraphQLService.request(query, {id: id});
    const building = result.building as any;
    return BuildingMapper.mapBuilding(building);
  }
}
