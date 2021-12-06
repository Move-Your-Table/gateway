import { Controller } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Delete, Patch, Post, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Building from "src/models/Building/Building";
import BuildingConstructor from "src/models/Building/BuildingConstructor";
import BuildingMutator from "src/models/Building/BuildingMutator";

@Controller("/admin/building")
@Tags("Buildings")
@Docs("admin-api")
export class BuildingAdminController {
  @Post()
  @Summary("Creates a building 🎊")
  @Returns(201, Building)
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  CreateBuilding(@BodyParams() payload: BuildingConstructor) {
    return {
      id: 22,
      ...payload,
      rooms: {
        total: 0,
        free: 0
      },
      desks: {
        total: 0,
        free: 0
      }
    };
  }

  @Patch("/:id")
  @Returns(200, Building)
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Edits a building 🥽")
  EditBuilding(@PathParams("id") id: number, @BodyParams() payload: BuildingMutator) {
    return {
      id: id,
      name: payload.name || "Unchanged Building Name",
      street: payload.street || "Unchanged Street Name",
      city: payload.city || "Unchanged City",
      postcode: payload.postcode || "Unchanged Code",
      country: payload.country || "Unchanged Country",
      rooms: {
        total: Math.floor(200),
        free: Math.floor(200)
      },
      desks: {
        total: Math.floor(200),
        free: Math.floor(200)
      }
    };
  }

  @Delete("/:id")
  @Summary("Deletes a building 🧨")
  @Returns(200, Building)
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  DeleteBuilding(@PathParams("id") id: number) {
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
