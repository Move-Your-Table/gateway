import { Controller } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Delete, Patch, Post, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import GraphQLService from "../../services/GraphQLService";
import Building from "../../models/Building/Building";
import BuildingConstructor from "../../models/Building/BuildingConstructor";
import BuildingMutator from "../../models/Building/BuildingMutator";
import BuildingMapper from "../../models/Building/BuildingMapper";

@Controller("/admin/building")
@Tags("Buildings")
@Docs("admin-api")
export class BuildingAdminController {
  @Post()
  @Summary("Creates a building 🎊")
  @Returns(201, Building)
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  async CreateBuilding(@BodyParams() payload: BuildingConstructor) {
    const query = gql`
    mutation addBuilding($buildingInput: BuildingInput!) {
      addBuilding(buildingInput: $buildingInput)
     {
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

    const buildingInput = {
      name: payload.name,
      address: {
        country: payload.country,
        postalcode: payload.postcode,
        city: payload.city,
        street: payload.street
      }
    }

    const result = await GraphQLService.request(query, {buildingInput: buildingInput});
    const building = result.addBuilding as any;
    return {
      street: building.address.street,
      city: building.address.city,
      postcode: building.address.postalcode,
      country: building.address.country,
      name: building.name,
      id: building._id
    }
  }

  @Patch("/:id")
  @Returns(200, Building)
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Edits a building 🥽")
  async EditBuilding(@PathParams("id") id: string, @BodyParams() payload: BuildingMutator) {
    const query = gql`
    mutation updateBuilding($id:String!, $buildingInput:BuildingUpdateInput!) {
      updateBuilding(id:$id,
        buildingInput: $buildingInput)
     {
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

    const buildingInput = {
      name: payload.name,
      address: {
        country: payload.country,
        postalcode: payload.postcode,
        city: payload.city,
        street: payload.street
      }
    };

    const result = await GraphQLService.request(query, {id: id, buildingInput: buildingInput});
    const building = result.updateBuilding as any;
    return BuildingMapper.mapBuilding(building);
  }

  @Delete("/:id")
  @Summary("Deletes a building 🧨")
  @Returns(200, Building)
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  async DeleteBuilding(@PathParams("id") id: string) {
    const query = gql`
    mutation deleteBuilding($id:String!) {
      deleteBuilding(id:$id)
     {
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
    const building = result.deleteBuilding as any;
    return BuildingMapper.mapBuilding(building);
  }
}
