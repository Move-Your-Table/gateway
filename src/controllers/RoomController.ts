import {PathParams, QueryParams} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import MaskedReservation from "src/models/Reservation/MaskedReservation";
import Room from "src/models/Room/Room";

@Controller("/building/:buildingId/room")
export class RoomController {
  @Get("/")
  @(Returns(200, Array).Of(Room).Description("OK"))
  @(Returns(404).Description("Not Found"))
  findAll(
    @PathParams("buildingId") id: number,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Array<Room<MaskedReservation>> {
    const json: Array<Room<MaskedReservation>> = [];
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
            dateTime: new Date()
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
  @(Returns(200, Room).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  findRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number): Room<MaskedReservation> {
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
          dateTime: new Date()
        }
      ]
    };
  }
}
