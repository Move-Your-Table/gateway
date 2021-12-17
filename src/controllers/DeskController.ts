import { PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Example, Format, Get, Required, Returns, string, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Desk from "../models/Desks/Desk";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import { gql } from "graphql-request";
import GraphQLService from "../services/GraphQlService";
import DeskMapper from "../models/Desks/DeskMapper";
import { fullDateCheck } from "../helpers/date";
import { BadRequest, NotFound } from "@tsed/exceptions";
import MaskedReservationMapper from "../models/Reservation/MaskedReservationMapper";
import GraphQlErrorHandler from "../helpers/error/GraphQLErrorHandler";

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
    const query = GraphQLQueries.allDesks(bId, rId)
    return GraphQLService.request(query)
      .then((response) => {
        GraphQLLogicHandler(response)
        return response.building.rooms[0].desks.map((desk: Array<any>) => DeskMapper.mapDesk(bId, rId, desk))
      })
      .then((response: Array<Desk<MaskedReservation>>) => { 
        return response
          .filter((room) => room.name.includes(name || ""))
          .filter((room) => (showWithIncidents ? room.incidents >= 0 : room.incidents === 0))
          .filter((room) => room.type.includes(type || ""));
      })
      .catch((err) => { 
        return GraphQLErrorHandler(err)
      });
  }

  @Get("/:deskId")
  @Summary("Get a 🔑-identified desk with 🎭 reservations")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  async findDesk(@PathParams("buildingId") bId: string, @PathParams("roomName") rId: string, @PathParams("deskId") dId: string): Promise<Desk<MaskedReservation>> {
    const query = GraphQLQueries.OneDesk(bId, rId, dId)
    return GraphQLService.request(query)
      .then((response) => {
        GraphQLLogicHandler(response)
        const desk = response.building.rooms[0].desks[0]
        return DeskMapper.mapDesk(bId, rId, desk)
      })
      .catch((err) => { 
        return GraphQLErrorHandler(err)
      })
  }

  @Get("/:deskId/reservations")
  @Summary("Get 🎭 reservations of a 🔑-identified desk")
  @(Returns(200, Array).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  async getReservationsPerRoom(
    @PathParams("buildingId")
    bId: string,
    @PathParams("roomName")
    rId: string,
    @PathParams("deskId")
    dId: string,
    @QueryParams("day")
    @Required()
    @Example("yyyy-MM-dd")
    @Format("regex")
    day: string
  ): Promise<Array<MaskedReservation>> {
    const query = GraphQLQueries.OneDesk(bId, rId, dId)
    const regex = RegExp("^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$")
    if (!regex.test(day)) { throw new BadRequest("The day parameter is not properly formatted.")}
    return GraphQLService.request(query)
      .then((response) => {
        GraphQLLogicHandler(response)
        const reservations: Array<any> = response.building.rooms[0].desks[0].bookings
        return reservations
          .map((reservation) => MaskedReservationMapper.mapReservation(bId, rId, dId, reservation, response.building.name))
          .filter(reservation => fullDateCheck(reservation.startTime, new Date(day)))
      })
      .catch((err) => { 
        return GraphQLErrorHandler(err)
      })
  }
}

/* Because GraphQL error message are inconsistent, Errors need to be judge on a case-by-case method */ 
function GraphQLErrorHandler(err: any): any { 
  if (err.response && err.response.errors) { throw new NotFound("Building not found") }
  throw err;
}

/* GraphQL doesn't error out when a key doesn't return a room, so this function takes care of that*/
function GraphQLLogicHandler(response: any): any { 
  if (response.building.rooms.length === 0) { throw new NotFound("Room not found") }
  if (response.building.rooms[0].desks.length === 0) { throw new NotFound("Desk not found") }
  return response;
}

class GraphQLQueries{ 
  static allDesks(bId: string, rId: string) { 
    return gql`
    query{
      building(id: "${bId}"){
        name,
        _id
        rooms(name: "${rId}"){
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
  }

  static OneDesk(bId: string, rId: string, dId: string) { 
    return gql`
    query{
      building(id: "${bId}"){
        name,
        rooms(name: "${rId}"){
          name,
          desks(name: "${dId}"){
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
  }
}
