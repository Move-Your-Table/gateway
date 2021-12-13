import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Delete, Example, Format, Get, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { fullDateCheck } from "../../helpers/date";
import Desk from "../../models/Desks/Desk";
import DeskConstructor from "../../models/Desks/DeskConstructor";
import DeskMutator from "../../models/Desks/DeskMutator";
import MaskedReservation from "../../models/Reservation/MaskedReservation";
import Reservation from "../../models/Reservation/Reservation";

@Controller("/admin/building/:buildingId/room/:roomId/desks")
@Docs("admin-api")
@Tags("Desks")
export class DeskAdminController {
  @Get("/")
  @Summary("Get all desks with 🔍 detailed reservations")
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
        features: [
          `${i} desk lamps`,
          `Excellent WI-Fi Access`,
          `LAN ports through FireWire`
        ],
        capacity: i,
        floor: i,
        reservations: [
          {
            id: Math.floor(200),
            room: {
              id: rId,
              name: `R&D Room`
            },
            building: {
              id: bId,
              name: `The Spire`
            },
            desk: {
              id: i,
              name: `Desk ${i}`
            },
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
  @Summary("Get a 🔑-identified desk with 🔍 detailed reservations")
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
      features: [
        `${dId} desk lamps`,
        `Excellent WI-Fi Access`,
        `LAN ports through FireWire`
      ],
      capacity: dId,
      floor: dId,
      reservations: [
        {
          id: Math.floor(200),
          room: {
            id: rId,
            name: `R&D Room`
          },
          building: {
            id: bId,
            name: `The Spire`
          },
          desk: {
            id: dId,
            name: `Desk ${dId}`
          },
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
  @Summary("Create a new desk 🎊")
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
      type: payload.type,
      incidents: 0,
      features: payload.features,
      capacity: payload.capacity,
      floor: payload.floor,
      reservations: []
    };
  }

  @Patch("/:deskId")
  @Summary("Edit a 🔑-identified desk 🥽")
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
            room: {
              id: rId,
              name: `R&D Room`
            },
            building: {
              id: bId,
              name: `The Spire`
            },
            desk: {
              id: rId,
              name: `Desk ${rId}`
            },
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
  @Summary("Delete a 🔑-identified desk 🧨")
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
      features: [
        `${dId} desk lamps`,
        `Excellent WI-Fi Access`,
        `LAN ports through FireWire`
      ],
      capacity: dId,
      floor: dId,
      reservations: [
        {
          id: Math.floor(200),
          room: {
            id: rId,
            name: `R&D Room`
          },
          building: {
            id: bId,
            name: `The Spire`
          },
          desk: {
            id: rId,
            name: `Desk ${rId}`
          },
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

  @Get("/:deskId/reservations")
  @(Returns(200, Array).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get 🔍 detailed reservations of a 🔑-identified desk")
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: number,
    @PathParams("roomId")
    rId: number,
    @PathParams("deskId") dId: number,
    @QueryParams("day")
    @Required()
    @Example("yyyy-MM-dd")
    @Format("regex")
    day: string
  ): Array<Reservation> {
    const dayData: Array<number> = day.split("-").map(int => parseInt(int))
    const refDate: Date = new Date(dayData[0], dayData[1], dayData[2])
    const json: Array<Reservation> = []
    for (let i = 0; i < 10; i++) {
      const element = {
        id: Math.floor(200),
        room: {
          id: rId,
          name: `R&D Room`
        },
        building: {
          id: bId,
          name: `The Spire`
        },
        desk: {
          id: rId,
          name: `Desk ${rId}`
        },
        startTime: new Date(),
        endTime: new Date(),
        reserved_for: {
          id: 1,
          first_name: "JJ",
          last_name: "Johnson",
          company: "NB Electronics"
        }
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
  }
}
