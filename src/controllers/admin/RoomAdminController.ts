import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Delete, Get, Patch, Post, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import MaskedReservation from "../../models/Reservation/MaskedReservation";
import Reservation from "../../models/Reservation/Reservation";
import Room from "../../models/Room/Room";
import RoomConstructor from "../../models/Room/RoomConstructor";
import RoomMutator from "../../models/Room/RoomMutator";
import { RoomController } from "../RoomController";
import { gql } from "graphql-request";
import GraphQLService from "../../services/GraphQLService";
import { InternalServerError, NotFound } from "@tsed/exceptions";
import ReservationMapper from "src/models/Reservation/ReservationMapper";

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
    @QueryParams("incidents") showWithIncidents: boolean = false,
    @QueryParams("type") type: string
  ): Promise<Array<Room<MaskedReservation|Reservation>>> {
   return await RoomController.getRooms(id, true, showWithIncidents, name, type);
  }

  @Get("/:roomName")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get a 🔑-identified room with 🔍 detailed reservations")
  async findRoom(@PathParams("buildingId") bId: string, 
  @PathParams("roomName") roomName: string,
  @QueryParams("incidents") showWithIncidents: boolean = false,): Promise<Room<MaskedReservation|Reservation>> {
   const rooms = await RoomController.getRooms(bId, true, showWithIncidents, roomName);
    if(rooms.length === 0) {
      throw new NotFound("Desks not found.");
    } else {
      return rooms[0];
    }
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
      name: payload.roomName,
      type: payload.type,
      floor: payload.floor,
      features: payload.features,
    }

    try {
      const result = await GraphQLService.request(query, {id:id, roomInput: roomInput});
      const room = result.addRoom as any;
      return {
        roomName: room.name,
        type: room.type,
        floor: room.floor,
        features: room.features,
        capacity: 0
      };
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }

  @Patch("/:roomName")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Edit a 🔑-identified room 🥽")
  async EditRoom(
    @PathParams("buildingId") bId: string,
    @PathParams("roomName") roomName: string,
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
      name: payload.roomName,
      type: payload.type,
      floor: payload.floor,
      features: payload.features,
    }

    try {
      const result = await GraphQLService.request(query, {id:bId, roomName: roomName, roomInput: roomInput});
      const room = result.updateRoom as any;
      return {
        roomName: room.roomName,
        type: room.type,
        floor: room.floor,
        features: room.features,
        capacity: 0
      };
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }

  @Delete("/:roomName")
  @(Returns(200, Room).Of(Reservation))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  @Summary("Delete a 🔑-identified room 🧨")
  async DeleteRoom(@PathParams("buildingId") buildingId: string, @PathParams("roomName") roomName: string)
  : Promise<any> {

    const buildingQuery = gql`
    query getSpecificBuilding($id: String!, $roomName: String!) {
      building(id: $id) {
        _id
        name
        address {
          street
          city
          postalcode
          country
        }
        rooms(name: $roomName){
          name
          deskCount  
          type
          floor
          features
          desks {
            name
            bookings {
              _id
              start_time
              end_time
              user {
                _id
                first_name
                last_name
                company
              }
            }
          }
        }
      }
    }
    `;

    const deleteRoomQuery = gql`
    mutation deleteroom {
      removeRoom(
        buildingId: "61bd136e80b2485adc82711e",
        roomName: "yeet"
      ) {
        deskCount
        name
        type
        floor
        features
      }
    }
    `;

    try {
      const buildingRes = await GraphQLService.request(buildingQuery, {id: buildingId, roomName: roomName});
      const building = buildingRes.building as any;

      let room = building.rooms[0];

      let reservations = [] as Array<MaskedReservation | Reservation>;
      building.rooms.forEach((room : any) => {
          room.desks.forEach((desk : any) => {
            desk.bookings.forEach((reservation : any) => {
              reservations.push(ReservationMapper.mapReservation(building, room, desk, reservation, true));
          });
        });
      });

      //await GraphQLService.request(deleteRoomQuery, {id:buildingId, roomName: roomName});
      
      return {
        roomName: room.name,
        type: room.type,
        floor: room.floor,
        features: room.features,
        capacity: 0,
        buildingId: buildingId,
        reservations: reservations
      };


    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }
}
