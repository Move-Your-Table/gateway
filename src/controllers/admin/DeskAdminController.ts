import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Delete, Example, Format, Get, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { fullDateCheck } from "../../helpers/date";
import { DeskController } from "../DeskController";
import Desk from "../../models/Desks/Desk";
import DeskConstructor from "../../models/Desks/DeskConstructor";
import DeskMutator from "../../models/Desks/DeskMutator";
import MaskedReservation from "../../models/Reservation/MaskedReservation";
import Reservation from "../../models/Reservation/Reservation";
import { gql } from "graphql-request";
import GraphQLService from "../../services/GraphQlService";

@Controller("/admin/building/:buildingId/room/:roomName/desks")
@Docs("admin-api")
@Tags("Desks")
export class DeskAdminController {
  @Get("/")
  @Summary("Get all desks with 🔍 detailed reservations")
  @(Returns(200, Array).Of(Desk).Description("OK"))
  @(Returns(404).Description("Not Found"))
  async findAll(
    @PathParams("buildingId") bId: string,
    @PathParams("roomName") roomName: string,
    @QueryParams("name") name: string,
    @QueryParams("incidents") showWithIncidents: boolean = false,
    @QueryParams("type") type: string
  ): Promise<Array<Desk<MaskedReservation|Reservation>>> {
    return await DeskController.getDesks(bId, roomName, name, true, showWithIncidents);
  }

  @Get("/:deskName")
  @Summary("Get a 🔑-identified desk with 🔍 detailed reservations")
  @(Returns(200, Desk).Of(MaskedReservation))
  @(Returns(404).Description("Not Found"))
  async findDesk(@PathParams("buildingId") bId: string, 
  @PathParams("roomName") roomName: string, 
  @PathParams("deskName") deskName: string,
  @QueryParams("incidents") showWithIncidents: boolean = false,
  ): Promise<Array<Desk<MaskedReservation|Reservation>>> {
    return await DeskController.getDesks(bId, roomName, deskName, true, showWithIncidents);
  }

  @Post()
  @Summary("Create a new desk 🎊")
  @(Returns(201, Desk).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  async CreateDesk(
    @BodyParams() payload: DeskConstructor,
    @PathParams("buildingId") bId: string,
    @PathParams("roomName") roomName: string
  ): Promise<DeskConstructor> {
    const query = gql`
      mutation addDesk($buildingId:String!, $roomName:String!, $deskInput:DeskInput!) {
        addDeskToRoom(buildingId: $buildingId, roomName: $roomName, deskInput: $deskInput) {
          name
          features
        }
      }
    `

    const deskInput = {
      name: payload.name,
      features: payload.features
    }

    const result = await GraphQLService.request(query, 
      {buildingId:bId, roomName: roomName, deskInput: deskInput});
    const desk = result.addDeskToRoom as any;
    return {
      name: desk.name,
      features: desk.features,
      type: "normal",
      floor: 0,
      capacity: 0
    };
  }

  @Patch("/:deskName")
  @Summary("Edit a 🔑-identified desk 🥽")
  @(Returns(200, Desk).Of(Reservation))
  @(Returns(400).Description("Bad Request"))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  async EditDesk(
    @PathParams("buildingId") bId: string,
    @PathParams("roomName") roomName: string,
    @PathParams("deskName") deskName: string,
    @QueryParams("clearIncidents") iClear: boolean,
    @QueryParams("clearReservations") rClear: boolean,
    @BodyParams() payload: DeskMutator
  ): Promise<DeskConstructor> {
    const query = gql`
      mutation updateDesk($buildingId:String!, $roomName:String!, $deskName:String!, $deskInput:DeskInput!) {
        updateDesk(buildingId: $buildingId, roomName: $roomName, deskName: $deskName, deskInput: $deskInput) {
          name
          features
        }
      }
    `

    const deskInput = {
      name: payload.name,
      features: payload.features
    }

    const result = await GraphQLService.request(query, 
      {buildingId:bId, roomName: roomName, deskName: deskName, deskInput: deskInput});
    const desk = result.updateDesk as any;
    return {
      name: desk.name,
      features: desk.features,
      type: "normal",
      floor: 0,
      capacity: 0
    };
  }

  @Delete("/:deskName")
  @Summary("Delete a 🔑-identified desk 🧨")
  @(Returns(200, Desk).Of(Reservation))
  @(Returns(403).Description("Unauthorized"))
  @(Returns(404).Description("Not Found"))
  async DeleteDesk(@PathParams("buildingId") bId: string, @PathParams("roomName") roomName: string, @PathParams("deskName") deskName: string,): Promise<DeskConstructor> {
    const query = gql`
    mutation removeDesk($buildingId:String!, $roomName:String!, $deskName:String!) {
      removeDesk(buildingId: $buildingId, roomName: $roomName, deskName: $deskName) {
        name
        features
      }
    }
  `

    const result = await GraphQLService.request(query, 
      {buildingId:bId, roomName: roomName, deskName: deskName});
    const desk = result.removeDesk as any;
    return {
      name: desk.name,
      features: desk.features,
      type: "normal",
      floor: 0,
      capacity: 0
    };
  }

  @Get("/:deskName/reservations")
  @(Returns(200, Array).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get 🔍 detailed reservations of a 🔑-identified desk")
  getReservationsPerRoom(
    @PathParams("buildingId")
    bId: string,
    @PathParams("roomName")
    rId: string,
    @PathParams("deskName") deskName: number,
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
        id: Math.floor(200).toString(),
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
          id: "1",
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
