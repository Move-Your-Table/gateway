import { PathParams, QueryParams } from "@tsed/common";
import {Controller} from "@tsed/di";
import { InternalServerError, NotFound } from "@tsed/exceptions";
import { Example, Format, Get, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import DeskMapper from "../models/Desks/DeskMapper";
import Reservation from "../models/Reservation/Reservation";
import GraphQLService from "../services/GraphQLService";
import Desk from "../models/Desks/Desk";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import ReservationMapper from "../models/Reservation/ReservationMapper";

@Controller("/building/:buildingId/room/:roomName/desks")
@Docs("general-api")
@Tags("Desks")
export class DeskController {
  @Get("/")
  @Summary("Get all desks with reservations")
  @(Returns(200, Array).Of(Desk).Description("OK"))
  @(Returns(404).Description("Not Found"))
  async findAll(
    @PathParams("buildingId") bId: string,
    @PathParams("roomName") roomName: string,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = false,
    @QueryParams("type") type: string
  ): Promise<Array<Desk<MaskedReservation>>> {
    const desks = await DeskController.getDesks(bId, roomName, name, false, showWithIncidents);

    if(desks.length === 0) {
      throw new NotFound("Desks not found.");
    } else {
      return desks;
    }
  }

  @Get("/:deskName")
  @Summary("Get a 🔑-identified desk with 🎭 reservations")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  async findRoom(@PathParams("buildingId") bId: string, 
  @PathParams("roomName") roomName: string, 
  @PathParams("deskName") deskName: string,
  @QueryParams("incidents") showWithIncidents: boolean = false,
  ): Promise<Desk<MaskedReservation>> {
    const desks = await DeskController.getDesks(bId, roomName, deskName, false, showWithIncidents);

    if(desks.length === 0) {
      throw new NotFound("Desks not found.");
    } else {
      return desks[0];
    }
  }

  @Get("/:deskName/reservations")
  @Summary("Get 🎭 reservations of a 🔑-identified desk")
  @(Returns(200, Array).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  async getReservationsPerRoom(
    @PathParams("buildingId")
    buildingId: string,
    @PathParams("roomName")
    roomName: string,
    @PathParams("deskName")
    deskName: string,
    @QueryParams("day")
    @Example("yyyy-MM-dd")
    @Format("regex")
    day: string
  ): Promise<Array<MaskedReservation>> {
    const dayData: Array<number> = day.split("-").map(int => parseInt(int))
    const refDate: Date = new Date(dayData[0], dayData[1], dayData[2]);

    // If date object is invalid it will return NaN. NaN is never equal to itself
    if(refDate.getTime() !== refDate.getTime()) {
      throw new InternalServerError("The given date is invalid");
    }
  
    const query = gql`
    query getDeskReservations($id: String!, $roomName: String!, $deskName: String!, $date: DateTime) {
      building(id: $id) {
        _id
        name
        rooms(name: $roomName){
          name
          desks(name: $deskName) {
            name
            bookings(at: $date) {
              _id
              start_time
              end_time
            }
          }
        }
      }
    }   
    `;

    try {
      const result = await GraphQLService.request(query, {id: buildingId, roomName: roomName, deskName: deskName, date: refDate});
      const deskReservations = result as any;

      let reservations = [] as Array<MaskedReservation>;
      const building = deskReservations.building;
      const room = building.rooms[0];
      const desk = room.desks[0];

      desk.bookings.forEach((reservation : any) => {
        reservations.push(ReservationMapper.mapReservation(building, room, desk, reservation, false));
      });

      return reservations;
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }

  static async getDesks(buildingId: string, 
    roomName: string, deskName: string, 
    detailedReservations: Boolean,
    incidentReports: Boolean) : Promise<Array<Desk<Reservation|MaskedReservation>>> {
    const query = gql`
    query getDesks($buildingId:String!, $roomName:String!, $deskName:String) {
      building(id:$buildingId) {
        _id
        rooms(name:$roomName) {
          name
          desks(name:$deskName) {
            name
            features
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
      const result = await GraphQLService.request(query, 
        {buildingId: buildingId, roomName: roomName, deskName: deskName});
      const building = result.building as any;
      return DeskMapper.mapDesks(building, detailedReservations, incidentReports);
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }
}
