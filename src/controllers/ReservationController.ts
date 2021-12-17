import { Controller } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Minimum, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "../models/Reservation/Reservation";
import ReservationConstructor from "../models/Reservation/ReservationConstructor";
import ReservationMutator from "../models/Reservation/ReservationMutator";
import DeleteReservationConstructor from "../models/Reservation/DeleteReservationConstructor";
import { gql } from "graphql-request";
import GraphQLService from "../services/GraphQlService";
import ReservationMapper from "../models/Reservation/ReservationMapper";
import { BuildingController } from "./BuildingController";
import { RoomController } from "./RoomController";
import { DeskController } from "./DeskController";
import MaskedReservation from "../models/Reservation/MaskedReservation";
import { NotFound } from "@tsed/exceptions";

@Controller("/reservations")
@Docs("admin-api", "general-api")
@Tags("Reservations")
export class ReservationController {
  @Get("/")
  @Summary("Get all reservations of a user")
  @Returns(200, Array).Of(Reservation)
  getReservations(@QueryParams("userId") @Required() @Minimum(0) id: string): Array<Reservation> {
    const json: Array<Reservation> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: (i + 1).toString(),
        building: {
          id: (i + 2).toString(),
          name: `building ${i + 2}`
        },
        room: {
          id: (i + 3).toString(),
          name: `room ${i + 3}`
        },
        desk: {
          id: (i + 4).toString(),
          name: `desk ${i + 4}`
        },
        startTime: new Date(),
        endTime: new Date(),
        reserved_for: {
          id: id,
          first_name: "JJ",
          last_name: "Johnson",
          company: "NB Electronics"
        }
      }
      json.push(element);
    }
    return json.filter(item => item.reserved_for.id === id);
  }

  @Post("/")
  @Summary("Make a reservation for a 🔑-identified desk")
  @Description("- For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(404).Description("Not Found")
  async CreateReservation(@BodyParams() payload: ReservationMutator): Promise<MaskedReservation | Reservation> {
    const reservationQuery = gql`
      mutation addBookingToDesk($id: String!, $roomName: String!, $deskName: String!, $bookingInput: BookingInput!) {
        addBookingToDesk(
          buildingId: $id,
          roomName: $roomName,
          deskName: $deskName,
          bookingInput: $bookingInput) 
        {
          _id
          user {
            _id
            first_name
            last_name
            company
          }
          start_time
          end_time 
        }
      }
    `
    
    const buildingQuery = gql`
      query getSpecificBuilding($id: String!, $roomName: String!, $deskName: String!) {
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
            desks(name: $deskName) {
              name
            }
          }
        }
      }
    `

    const buildingRes = await GraphQLService.request(buildingQuery, {id: payload.buildingId, roomName: payload.roomName, deskName: payload.deskName});
    const building = buildingRes.building as any;
    
    let rooms = building.rooms;

    let room = rooms[0];
    let desk = room.desks[0];

    const bookingInput = {
      user_id: payload.userId,
      start_time: payload.startTime,
      end_time: payload.endTime,
      public: true,
    }
    const result = await GraphQLService.request(reservationQuery, {id:payload.buildingId, roomName: payload.roomName, deskName: payload.deskName, bookingInput: bookingInput});
    const reservation = result.addBookingToDesk as any;

    return ReservationMapper.mapReservation(building, room, desk, reservation, true);
  }

  @Delete("/:reservationId")
  @Summary("Delete a 🔑-identified reservation 🧨")
  @Returns(200, Reservation)
  @Returns(404).Description("Not Found")
  async deleteReservation(@PathParams("reservationId") reservationId: string, @BodyParams() payload: DeleteReservationConstructor): Promise<MaskedReservation | Reservation> {
    console.log("DELETING");
    const deleteReservationQuery = gql`
    mutation deleteReservation($id: String!, $roomName: String!, $deskName: String!, $bookingId: String!) {
      cancelBookingFromDesk(
        buildingId: $id,
        roomName: $roomName,
        deskName: $deskName,
        bookingId: $bookingId)
      {
        _id
        user {
          _id
          first_name
          last_name
          company
        }
        start_time
        end_time 
      }
    }
    
    `


    const buildingQuery = gql`
      query getSpecificBuilding($id: String!, $roomName: String!, $deskName: String!) {
        building(id: $id) {
          _id
          name
          rooms(name: $roomName){
            name
            desks(name: $deskName) {
              name
            }
          }
        }
      }
    `

    const buildingRes = await GraphQLService.request(buildingQuery, {id: payload.buildingId, roomName: payload.roomName, deskName: payload.deskName});
    const building = buildingRes.building as any;

    let rooms = building.rooms;

    let room = rooms[0];
    let desk = room.desks[0];

    const result = await GraphQLService.request(deleteReservationQuery, {id:payload.buildingId, roomName: payload.roomName, deskName: payload.deskName, bookingId: reservationId});
    const reservation = result.cancelBookingFromDesk as any;

    return ReservationMapper.mapReservation(building, room, desk, reservation, true);

  }
}
