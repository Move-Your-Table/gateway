import {PathParams, QueryParams} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import Room from "src/models/Room/Room";

@Controller("/admin/building/:id/room")
export class RoomAdminController {
  @Get("/")
  @(Returns("200", Array).Of(Room))
  @(Returns(404).Description("Not Found"))
  findAll(
    @PathParams("buildingId") id: number,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Array<Room> {
    const json: Array<Room> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        buildingId: id,
        name: `R&D Room ${i}`,
        type: `R&D Room`,
        incidents: i,
        features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>${i} workbenches</li><li>${
          5 + i
        } PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
        reservations: [
          {
            id: Math.floor(200),
            roomId: i,
            deskId: undefined,
            dateTime: new Date(),
            person: {
              id: 1,
              first_name: "JJ",
              last_name: "Johnson",
              company: "NB Electronics"
            }
          }
        ]
      };
      json.push(element);
    }
    return json
      .filter((room) => room.name.includes(name || ""))
      .filter((room) => (showWithIncidents ? room.incidents >= 0 : room.incidents === 0))
      .filter((room) => room.type.includes(type || ""));
  }
}
