import {BodyParams, PathParams, QueryParams} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Delete, Get, Patch, Post, Returns} from "@tsed/schema";
import Reservation from "src/models/Reservation/Reservation";
import Room from "src/models/Room/Room";
import RoomConstructor from "src/models/Room/RoomConstructor";
import RoomMutator from "src/models/Room/RoomMutator";

@Controller("/admin/building/:buildingId/room")
export class RoomAdminController {
  @Get("/")
  @(Returns(404).Description("Not Found"))
  //TODO: Fix documentation issue (Return correct object)
  @(Returns(200, Array).Of(Room).Description("OK"))
  findAll(
    @PathParams("buildingId") id: number,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Array<Room<Reservation>> {
    const json: Array<Room<Reservation>> = [];
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
        capacity: i,
        floor: i,
        reservations: [
          {
            id: Math.floor(200),
            roomId: i,
            deskId: undefined,
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

  @Get("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  findRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number): Room<Reservation> {
    return {
      id: rId,
      buildingId: bId,
      name: `R&D Room ${rId}`,
      type: `R&D Room`,
      incidents: Math.floor(10),
      features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>5 workbenches</li><li>3 PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
      capacity: bId,
      floor: bId,
      reservations: [
        {
          id: Math.floor(200),
          roomId: rId,
          deskId: undefined,
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
  @(Returns(201, Room).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  CreateRoom(@BodyParams() payload: RoomConstructor, @PathParams("buildingId") id: number,): Room<Reservation> {
    return {
      id: 22,
      buildingId: id,
      name: payload.name,
      type: payload.features,
      incidents: 0,
      features: payload.features,
      capacity: payload.capacity,
      floor: payload.floor,
      reservations: []
    };
  }

  @Patch("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  EditRoom(
    @PathParams("buildingId") bId: number,
    @PathParams("roomId") rId: number,
    @QueryParams("clearIncidents") iClear: boolean,
    @QueryParams("clearReservations") rClear: boolean,
    @BodyParams() payload: RoomMutator
  ): Room<Reservation> {
    return {
      id: rId,
      buildingId: bId,
      name: payload.name || "Unchanged Building Name",
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
              roomId: rId,
              deskId: undefined,
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

  @Delete("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  DeleteRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number): Room<Reservation> {
    return {
      id: rId,
      buildingId: bId,
      name: `R&D Room ${rId}`,
      type: `R&D Room`,
      incidents: Math.floor(10),
      features: `<p>A fully-fledged R&D rooms that contains the following features:</p><ul><li>5 workbenches</li><li>3 PCs</li><li>Excellent WI-Fi Access</li><li>LAN ports through FireWire</li></ul>`,
      capacity: bId,
      floor: bId,
      reservations: [
        {
          id: Math.floor(200),
          roomId: rId,
          deskId: undefined,
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
