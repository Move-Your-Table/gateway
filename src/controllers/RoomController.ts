import { PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Example, Format, Get, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import RoomMapper from "../models/Room/RoomMapper";
import GraphQLService from "../services/GraphQlService";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import Room from "../models/Room/Room";
import { fullDateCheck } from "../helpers/date";
import Reservation from "../models/Reservation/Reservation";

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
  

  @Get("/:roomId")
  @(Returns(200, Room).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Returns 🔑-identified room with 🎭 reservations")
  async findDesk(@PathParams("buildingId") bId: string, 
  @PathParams("roomId") rId: string,
  @QueryParams("incidents") showWithIncidents: boolean = true): Promise<Room<MaskedReservation>|null> {
    const rooms = await RoomController.getRooms(bId, false, showWithIncidents, rId);

    if(rooms.length === 0) {
      return null;
    } else {
      return rooms[0];
    }
  }

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
        endTime: new Date()
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
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

    const result = await GraphQLService.request(query, {id: buildingId, name: roomName, type: type});
    const building = result.building as any;
    return RoomMapper.mapRooms(building, detailedReservations, incidentReports);
  }
}



