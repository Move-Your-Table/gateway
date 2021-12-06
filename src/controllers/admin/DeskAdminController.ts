import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import {Controller} from "@tsed/di";
import {Delete, Get, Patch, Post, Returns} from "@tsed/schema";
import Desk from "src/models/Desks/Desk";
import DeskConstructor from "src/models/Desks/DeskConstructor";
import DeskMutator from "src/models/Desks/DeskMutator";
import MaskedReservation from "src/models/Reservation/MaskedReservation";
import Reservation from "src/models/Reservation/Reservation";

@Controller("/admin/building/:buildingId/room/:roomId/desks")
export class DeskAdminController {
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
  ): Array<Desk<Reservation>> {
    const json: Array<Desk<Reservation>> = [];
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
            endTime: new Date(),
            reserved_for: {
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

  @Get("/:deskId")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  findDesk(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number, @PathParams("deskId") dId: number): Desk<Reservation> {
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
          endTime: new Date(),
          reserved_for: {
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
  @(Returns(201, Desk).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  CreateDesk(
    @BodyParams() payload: DeskConstructor, 
    @PathParams("buildingId") bId: number,
    @PathParams("roomId") rId: number
  ): Desk<Reservation> {
    return {
      id: 22,
      buildingId: bId,
      roomId: rId,
      name: payload.name,
      type: payload.features,
      incidents: 0,
      features: payload.features,
      capacity: payload.capacity,
      floor: payload.floor,
      reservations: []
    };
  }

  @Patch("/:deskId")
  @(Returns(200, Desk).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  EditDesk(
    @PathParams("buildingId") bId: number,
    @PathParams("roomId") rId: number,
    @PathParams("deskId") dId: number,
    @QueryParams("clearIncidents") iClear: boolean,
    @QueryParams("clearReservations") rClear: boolean,
    @BodyParams() payload: DeskMutator
  ): Desk<Reservation> {
    return {
      id: dId,
      buildingId: bId,
      roomId: rId,
      name: payload.name || "Unchanged Desk Name",
      type: payload.type || "Unchanged type",
      incidents: iClear ? 0 : 10,
      features: payload.features || "Unchanged features",
      capacity: payload.capacity || 10,
      floor: payload.floor || 1,
      reservations: rClear
        ? []
        : [
          {
            id: Math.floor(200),
            buildingId: bId,
            roomId: rId,
            deskId: dId,
            startTime: new Date(),
            endTime: new Date(),
            reserved_for: {
              id: 1,
              first_name: "JJ",
              last_name: "Johnson",
              company: "NB Electronics"
            }
          }
        ]
    };
  }

  @Delete("/:deskId")
  @(Returns(200, Desk).Of(Reservation))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  DeleteDesk(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number, @PathParams("deskId") dId: number,): Desk<Reservation> {
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
          endTime: new Date(),
          reserved_for: {
            id: 1,
            first_name: "JJ",
            last_name: "Johnson",
            company: "NB Electronics"
          }
        }
      ]
    };
  }
}
