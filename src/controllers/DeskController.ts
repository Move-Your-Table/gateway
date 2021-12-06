import { PathParams, QueryParams } from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import Desk from "src/models/Desks/Desk";
import MaskedReservation from "src/models/Reservation/MaskedReservation";

@Controller("/building/:buildingId/room/:roomId/desks")
export class DeskController {
  @Get("/")
  //TODO: Fix documentation issue (Return correct object)
  @(Returns(200, Array).Of(Desk).Description("OK"))
  @(Returns(404).Description("Not Found"))
  findAll(
    @PathParams("buildingId") bId: number,
    @PathParams("roomId") rId: number,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Array<Desk<MaskedReservation>> {
    const json: Array<Desk<MaskedReservation>> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        buildingId: bId,
        roomId: rId,
        name: `Dual Desk ${i}`,
        type: `Dual Desk`,
        incidents: i,
        features: `<p>A double-sized desks, perfect for sharing with 2 coworkers!</p><ul><li>${i} desk lamps</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
        capacity: i,
        floor: i,
        reservations: [
          {
            id: Math.floor(200),
            buildingId: bId,
            roomId: rId,
            deskId: i,
            startTime: new Date(),
            endTime: new Date()
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

  @Get("/:deskId")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  findRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number, @PathParams("deskId") dId: number): Desk<MaskedReservation> {
    return {
      id: dId,
      buildingId: bId,
      roomId: rId,
      name: `Dual Desk ${dId}`,
      type: `Dual Desk`,
      incidents: dId,
      features: `<p>A double-sized desks, perfect for sharing with 2 coworkers!</p><ul><li>${dId} desk lamps</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
      capacity: dId,
      floor: dId,
      reservations: [
        {
          id: Math.floor(200),
          buildingId: bId,
          roomId: rId,
          deskId: dId,
          startTime: new Date(),
          endTime: new Date()
        }
      ]
    };
  }
}
