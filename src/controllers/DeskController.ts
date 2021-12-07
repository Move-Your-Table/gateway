import { PathParams, QueryParams } from "@tsed/common";
import {Controller} from "@tsed/di";
import { Example, Format, Get, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { fullDateCheck } from "src/helpers/date";
import Desk from "src/models/Desks/Desk";
import MaskedReservation from "src/models/Reservation/MaskedReservation";

@Controller("/building/:buildingId/room/:roomId/desks")
@Docs("general-api")
@Tags("Desks")
export class DeskController {
  @Get("/")
  @Summary("Get all desks with reservations")
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
  @Summary("Get a 🔑-identified desk with 🎭 reservations")
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

  @Get("/:deskId/reservations")
  @Summary("Get 🎭 reservations of a 🔑-identified desk")
  @(Returns(200, Array).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: number,
    @PathParams("roomId")
    rId: number,
    @PathParams("deskId")
    dId: number,
    @QueryParams("day")
    @Required()
    @Example("yyyy-MM-dd")
    @Format("regex")
    day: string
  ): Array<MaskedReservation> {
    const dayData: Array<number> = day.split("-").map(int => parseInt(int))
    const refDate: Date = new Date(dayData[0], dayData[1], dayData[2])
    const json: Array<MaskedReservation> = []
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        buildingId: bId,
        roomId: rId,
        deskId: dId,
        startTime: new Date(),
        endTime: new Date()
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
  }
}
