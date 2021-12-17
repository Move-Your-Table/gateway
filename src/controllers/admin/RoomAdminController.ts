import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Delete, Example, Format, Get, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import MaskedReservation from "../../models/Reservation/MaskedReservation";
import { fullDateCheck } from "../../helpers/date";
import Reservation from "../../models/Reservation/Reservation";
import Room from "../../models/Room/Room";
import RoomConstructor from "../../models/Room/RoomConstructor";
import RoomMutator from "../../models/Room/RoomMutator";
import { RoomController } from "../RoomController";
import { gql } from "graphql-request";
import GraphQLService from "../../services/GraphQLService";

@Controller("/admin/building/:buildingId/room")
@Docs("admin-api")
@Tags("Rooms")
export class RoomAdminController {
  @Get("/")
  @Summary("Get all rooms with 🔍 detailed reservations")
  @(Returns(404).Description("Not Found"))
  @(Returns(200, Array).Of(Room).Description("OK"))
  async findAll(
    @PathParams("buildingId") id: string,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Promise<Array<Room<MaskedReservation|Reservation>>> {
   return await RoomController.getRooms(id, true, name, type);
  }

  @Get("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get a 🔑-identified room with 🔍 detailed reservations")
  async findRoom(@PathParams("buildingId") bId: string, @PathParams("roomId") rId: string): Promise<Array<Room<MaskedReservation|Reservation>>> {
    return await RoomController.getRooms(bId, true, rId);
  }

  @Post()
  @(Returns(201, Room).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @Summary("Create a new room 🎊")
  async CreateRoom(@BodyParams() payload: RoomConstructor, @PathParams("buildingId") id: string): Promise<RoomConstructor> {
    const query = gql`
      mutation addRoom($id: String!, $roomInput: RoomInput!) {
        addRoom(buildingId: $id, roomInput: $roomInput) {
          name
          type
          floor
          features
        }
      }
    `

    const roomInput = {
      name: payload.name,
      type: payload.type,
      floor: payload.floor,
      features: payload.features,
    }

    const result = await GraphQLService.request(query, {id:id, roomInput: roomInput});
    const room = result.addRoom as any;
    return {
      name: room.name,
      type: room.type,
      floor: room.floor,
      features: room.features,
      capacity: 0
    };
  }

  @Patch("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Edit a 🔑-identified room 🥽")
  async EditRoom(
    @PathParams("buildingId") bId: string,
    @PathParams("roomId") rId: string,
    @BodyParams() payload: RoomMutator
  ): Promise<RoomConstructor> {
    const query = gql`
      mutation updateRoom($id: String!, $roomName: String!, $roomInput: RoomUpdateInput!) {
        updateRoom(buildingId: $id, 
          roomName: $roomName,
          roomInput: $roomInput) {
            name
            type
            floor
            features
        }
      }
    `

    const roomInput = {
      name: payload.name,
      type: payload.type,
      floor: payload.floor,
      features: payload.features,
    }

    const result = await GraphQLService.request(query, {id:bId, roomName: rId, roomInput: roomInput});
    const room = result.updateRoom as any;
    return {
      name: room.name,
      type: room.type,
      floor: room.floor,
      features: room.features,
      capacity: 0
    };
  }

  @Delete("/:roomId")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Delete a 🔑-identified room 🧨")
  DeleteRoom(@PathParams("buildingId") bId: number, @PathParams("roomId") rId: number): Room<Reservation> {
    return {
      id: rId,
      buildingId: bId,
      name: `R&D Room ${rId}`,
      type: `R&D Room`,
      incidents: Math.floor(10),
      features: ["yeet"],
      capacity: bId,
      floor: bId,
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
          desk: undefined,
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

  @Get("/:roomId/reservations")
  @(Returns(200, Array).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get 🔍 detailed reservations of a 🔑-identified room")
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
        desk: undefined,
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
