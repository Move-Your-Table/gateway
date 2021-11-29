import {BodyParams, PathParams, QueryParams} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Post, Returns} from "@tsed/schema";
import Room from "src/models/Room/Room";
import RoomConstructor from "src/models/Room/RoomConstructor";

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

  @Get("/:roomId")
  @Returns("200", Room)
  @(Returns(404).Description("Not Found"))
  findRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number) {
    return {
      id: rId,
      buildingId: bId,
      name: `R&D Room ${rId}`,
      type: `R&D Room`,
      incidents: Math.floor(10),
      features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>5 workbenches</li><li>3 PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
      reservations: [
        {
          id: Math.floor(200),
          roomId: rId,
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
  }

  @Post()
  @Returns(201, Room)
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  CreateBuilding(@BodyParams() payload: RoomConstructor) {
    return {
      id: 22,
      buildingId: payload.buildingId,
      name: payload.name,
      type: payload.features,
      incidents: 0,
      features: payload.features,
      reservations: []
    };
  }
}
