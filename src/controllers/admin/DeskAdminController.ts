import { BodyParams, PathParams, QueryParams } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Delete, Example, Format, Get, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import { DeskController } from "../DeskController";
import Desk from "../../models/Desks/Desk";
import DeskConstructor from "../../models/Desks/DeskConstructor";
import DeskMutator from "../../models/Desks/DeskMutator";
import MaskedReservation from "../../models/Reservation/MaskedReservation";
import Reservation from "../../models/Reservation/Reservation";
import { gql } from "graphql-request";
import GraphQLService from "../../services/GraphQLService";
import { InternalServerError, NotFound } from "@tsed/exceptions";
import ReservationMapper from "src/models/Reservation/ReservationMapper";

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
  ): Promise<Desk<MaskedReservation|Reservation>> {
    const desks = await DeskController.getDesks(bId, roomName, deskName, true, showWithIncidents);

    if(desks.length === 0) {
      throw new NotFound("Desk not found.");
    } else {
      return desks[0];
    }
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
      name: payload.deskName,
      features: payload.features
    }

    try {
      const result = await GraphQLService.request(query, 
        {buildingId:bId, roomName: roomName, deskInput: deskInput});
      const desk = result.addDeskToRoom as any;
      return {
        deskName: desk.name,
        features: desk.features,
        type: "normal",
        floor: 0,
        capacity: 0
      };
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
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
      name: payload.deskName,
      features: payload.features
    }

    const result = await GraphQLService.request(query, 
      {buildingId:bId, roomName: roomName, deskName: deskName, deskInput: deskInput});
    const desk = result.updateDesk as any;
    return {
      deskName: desk.name,
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

    try {
      const result = await GraphQLService.request(query, 
        {buildingId:bId, roomName: roomName, deskName: deskName});
      const desk = result.removeDesk as any;
      return {
        deskName: desk.name,
        features: desk.features,
        type: "normal",
        floor: 0,
        capacity: 0
      };
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }

  @Get("/:deskName/reservations")
  @(Returns(200, Array).Of(Reservation))
  @(Returns(404).Description("Not Found"))
  @Summary("Get 🔍 detailed reservations of a 🔑-identified desk")
  async getReservationsPerRoom(
    @PathParams("buildingId") buildingId: string,
    @PathParams("roomName") roomName: string,
    @PathParams("deskName") deskName: string,
    @QueryParams("day")
    @Example("yyyy-MM-dd")
    @Format("regex")
    day: string
  ): Promise<Array<MaskedReservation>> {
    
    let refDate;
    if(day) {
      const dayData: Array<number> = day.split("-").map(int => parseInt(int))
      refDate = new Date(dayData[0], dayData[1], dayData[2]);

      // If date object is invalid it will return NaN. NaN is never equal to itself
      if(refDate.getTime() !== refDate.getTime()) {
        throw new InternalServerError("The given date is invalid");
      }
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

    try {
      const result = await GraphQLService.request(query, {id: buildingId, roomName: roomName, deskName: deskName, date: refDate});
      const deskReservations = result as any;

      let reservations = [] as Array<MaskedReservation>;
      const building = deskReservations.building;
      const room = building.rooms[0];
      const desk = room.desks[0];

      desk.bookings.forEach((reservation : any) => {
        reservations.push(ReservationMapper.mapReservation(building, room, desk, reservation, true));
      });

      return reservations;
    } catch(error) {
      throw new InternalServerError(error.response.errors[0].message);
    }
  }
}
