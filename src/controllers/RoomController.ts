import { PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Get, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import RoomMapper from "../models/Room/RoomMapper";
import GraphQLService from "../services/GraphQLService";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import Room from "../models/Room/Room";
import Reservation from "../models/Reservation/Reservation";
import { InternalServerError, NotFound } from "@tsed/exceptions";

@Controller("/building/:buildingId/room")
@Docs("general-api")
@Tags("Rooms")
export class RoomController {
  @Get("/")
  @Summary("Get all rooms with 🎭 reservations.")
  @(Returns(200, Array).Of(Room).Description("OK"))
  @(Returns(404).Description("Not Found"))
  async findAll(
    @PathParams("buildingId") id: string,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = false,
    @QueryParams("type") type: string
  ): Promise<Array<Room<MaskedReservation>>> {
      return await RoomController.getRooms(id, false, showWithIncidents ,name, type);
    }
  

  @Get("/:roomName")
  @(Returns(200, Room).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Returns 🔑-identified room with 🎭 reservations")
  async findDesk(@PathParams("buildingId") bId: string, 
  @PathParams("roomName") roomName: string,
  @QueryParams("incidents") showWithIncidents: boolean = true): Promise<Room<MaskedReservation>|null> {
    const rooms = await RoomController.getRooms(bId, false, showWithIncidents, roomName);

    if(rooms.length === 0) {
      throw new NotFound("Desks not found.");
    } else {
      return rooms[0];
    }
  }

  static async getRooms(buildingId: string, detailedReservations: Boolean, incidentReports : Boolean,
    roomName: string, type: string = "") : Promise<Array<Room<Reservation|MaskedReservation>>> {
    const query = gql`
    query getRooms($id:String!, $name: String, $type: String) {
      building(id:$id) {
        _id
        name
        rooms(name:$name, type:$type) {
          name
          type
          features
          floor
          incidentReports {
            _id
            message
            user {
              _id
              first_name
              last_name
              company
            }
          }
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
    `

    try {
      const result = await GraphQLService.request(query, {id: buildingId, name: roomName, type: type});
      const building = result.building as any;
      return RoomMapper.mapRooms(building, detailedReservations, incidentReports);
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }
}



