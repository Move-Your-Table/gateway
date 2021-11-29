import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/admin/building/:id/room")
export class RoomAdminControllerController {
  @Get("/")
  get() {
    return "hello";
  }
}
