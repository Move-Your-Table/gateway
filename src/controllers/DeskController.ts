import { PathParams, QueryParams } from "@tsed/common";
import {Controller} from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { Example, Format, Get, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { gql } from "graphql-request";
import DeskMapper from "../models/Desks/DeskMapper";
import Reservation from "../models/Reservation/Reservation";
import GraphQLService from "../services/GraphQlService";
import { fullDateCheck } from "../helpers/date";
import Desk from "../models/Desks/Desk";
import MaskedReservation from "../models/Reservation/MaskedReservation";

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
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Promise<Array<Desk<MaskedReservation>>> {
    const desks = await DeskController.getDesks(bId, roomName, name, false);

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
  async findRoom(@PathParams("buildingId") bId: string, @PathParams("roomName") roomName: string, @PathParams("deskName") deskName: string): Promise<Desk<MaskedReservation>> {
    const desks = await DeskController.getDesks(bId, roomName, deskName, false);

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
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: string,
    @PathParams("roomName")
    roomName: string,
    @PathParams("deskName")
    deskName: string,
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
        id: Math.floor(200).toString(),
        room: {
          id: roomName,
          name: `R&D Room`
        },
        building: {
          id: bId,
          name: `The Spire`
        },
        desk: {
          id: deskName,
          name: `Desk ${i}`
        },
        startTime: new Date(),
        endTime: new Date()
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
  }

  static async getDesks(buildingId: string, roomName: string, deskName: string, detailedReservations: Boolean) : Promise<Array<Desk<Reservation|MaskedReservation>>> {
    const query = gql`
    query getDesks($buildingId:String!, $roomName:String!, $deskName:String) {
      building(id:$buildingId) {
        _id
        rooms(name:$roomName) {
          name
          desks(name:$deskName) {
            name
            incidentReports {
              _id
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

    const result = await GraphQLService.request(query, 
      {buildingId: buildingId, roomName: roomName, deskName: deskName});
    const building = result.building as any;
    return DeskMapper.mapDesks(building, detailedReservations);
  }
}
