import { PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Example, Format, Get, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { fullDateCheck } from "../helpers/date";
import Desk from "../models/Desks/Desk";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import { gql } from "graphql-request";
import GraphQLService from "../services/GraphQlService";
import DeskMapper from "../models/Desks/DeskMapper";

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
    @PathParams("roomName") rId: string,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = true,
    @QueryParams("type") type: string
  ): Promise<Array<Desk<MaskedReservation>>> {
    const query = gql`
    query{
      building(id: "61b9ee2068ded859109fdc82"){
        name,
        _id
        rooms(name: "Room 1"){
          name,
          desks{
            name,
            incidentReports{_id},
            bookings{
              _id,
              start_time,
              end_time,
            }
          }
        }
      }
    }`
    return GraphQLService.request(query)
      .then((response) => { 
        return response.building.rooms[0].desks
          .map(
            (desk: Array<any>) => DeskMapper.mapDesk(bId, rId, desk)
          )
      })
      .then((response: Array<Desk<MaskedReservation>>) => { 
        return response.filter((room) => room.name.includes(name || ""))
          .filter((room) => (showWithIncidents ? room.incidents >= 0 : room.incidents === 0))
          .filter((room) => room.type.includes(type || ""));
      })
      
  }

  @Get("/:deskId")
  @Summary("Get a 🔑-identified desk with 🎭 reservations")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  findRoom(@PathParams("buildingId") bId: number, @PathParams("roomName") rId: number, @PathParams("deskId") dId: number): Desk<MaskedReservation> {
    return {
      id: dId,
      buildingId: bId,
      roomName: rId,
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
          endTime: new Date()
        }
      ]
    };
  }

  @Get("/:deskId/reservations")
  @Summary("Get 🎭 reservations of a 🔑-identified desk")
  @(Returns(200, Array).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: number,
    @PathParams("roomName")
    rId: number,
    @PathParams("deskId")
    dId: number,
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
        desk: {
          id: i,
          name: `Desk ${i}`
        },
        startTime: new Date(),
        endTime: new Date()
      }
      json.push(element);
    };
    return json.filter(reservation => fullDateCheck(reservation.startTime, refDate))
  }
}
