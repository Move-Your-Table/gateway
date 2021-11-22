import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Put, Returns} from "@tsed/schema";
import {Docs} from "@tsed/swagger";
import Building from "src/models/Building";
import BuildingConstructor from "src/models/BuildingConstructor";
import {BuildingController} from "../BuildingController";

@Controller("/admin/building")
@Docs("Admin")
export class BuildingAdminController extends BuildingController {
  @Put()
  @Returns(201, Building)
  CreateBuilding(@BodyParams() payload: BuildingConstructor) {
    return {
      id: 22,
      rooms: {
        total: 0,
        free: 0
      },
      desks: {
        total: 0,
        free: 0
      },
      ...payload
    };
  }
}
