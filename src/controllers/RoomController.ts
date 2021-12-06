import { PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Description, Example, Format, Get, Name, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { fullDateCheck } from "src/helpers/date";
import MaskedReservation from "src/models/Reservation/MaskedReservation";
import Room from "src/models/Room/Room";

@Controller("/building/:buildingId/room")
@Docs("general-api")
@Tags("Rooms")
export class RoomController {
  @Get("/")
  @Summary("Get all rooms with 🎭 reservations.")
  //TODO: Fix documentation issue (Return correct object)
  //TODO: Hide controller when Admin API sheet is loaded
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
        features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>${i} workbenches</li><li>${5 + i
          } PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
        capacity: i,
        floor: i,
        reservations: [
          {
            id: Math.floor(200),
            roomId: i,
            buildingId: id,
            deskId: undefined,
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

  @Get("/:roomId")
  @(Returns(200, Room).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Returns 🔑-identified room with 🎭 reservations")
  findDesk(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number): Room<MaskedReservation> {
    return {
      id: rId,
      buildingId: bId,
      name: `R&D Room ${rId}`,
      type: `R&D Room`,
      incidents: Math.floor(10),
      features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>5 workbenches</li><li>3 PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
      capacity: rId,
      floor: rId,
      reservations: [
        {
          id: Math.floor(200),
          roomId: rId,
          buildingId: bId,
          deskId: undefined,
          startTime: new Date(),
          endTime: new Date()
        }
      ]
    };
  }

  //TODO: Implement Regex Validation for Query Parameter
  //      Normally, TS.ed provides a function for that, but currently I do not get it to function
  //      Regex -> "^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$""
  @Get("/:roomId/reservations")
  @(Returns(200, Array).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Returns 🎭 reservations of a 🔑-identified  room")
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: number,
    @PathParams("roomId")
    rId: number,
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
        deskId: undefined,
        startTime: new Date(),
        endTime: new Date()
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
  }
}



