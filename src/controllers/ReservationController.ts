import { Controller } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Minimum, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "../models/Reservation/Reservation";
import ReservationConstructor from "../models/Reservation/ReservationConstructor";
import ReservationMutator from "../models/Reservation/ReservationMutator";
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
  getReservations(@QueryParams("userId") @Required() @Minimum(0) id: number): Array<Reservation> {
    const json: Array<Reservation> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i + 1,
        building: {
          id: i + 2,
          name: `building ${i + 2}`
        },
        room: {
          id: i + 3,
          name: `room ${i + 3}`
        },
        desk: {
          id: i + 4,
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
    console.log("START");
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

    const buildingRes = await GraphQLService.request(buildingQuery, {id: payload.buildingId, roomName: payload.roomId, deskName: payload.deskId});
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
    const result = await GraphQLService.request(reservationQuery, {id:payload.buildingId, roomName: payload.roomId, deskName: payload.deskId, bookingInput: bookingInput});
    const reservation = result.addBookingToDesk as any;

    return ReservationMapper.mapReservation(building, room, desk, reservation, true);
  }




  // @Patch("/:reservationId")
  // @Summary("Edit a 🔑-identified reservation 🥽")
  // @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  // @Returns(200, Reservation)
  // @Returns(400).Description("Bad Request")
  // @Returns(404).Description("Not Found")
  // editReservation(@BodyParams() payload: ReservationMutator, @PathParams("reservationId") rId: number): Reservation {
  //   return {
  //     id: rId,
  //     building: {
  //       id: payload.buildingId || 0,
  //       name: (payload.buildingId) ? "Changed name" : "Unchanged name"
  //     },
  //     room: {
  //       id: payload.roomId || 0,
  //       name: (payload.roomId) ? "Changed name" : "Unchanged name"
  //     },
  //     desk: {
  //       id: payload.deskId || 0,
  //       name: (payload.deskId) ? "Changed name" : "Unchanged name"
  //     },
  //     startTime: new Date(payload.startTime) || new Date(),
  //     endTime: new Date(payload.endTime) || new Date(),
  //     reserved_for: {
  //       id: 1,
  //       first_name: "JJ",
  //       last_name: "Johnson",
  //       company: "NB Electronics"
  //     }
  //   }
  // }

  @Delete("/:reservationId")
  @Summary("Delete a 🔑-identified reservation 🧨")
  @Returns(200, Reservation)
  @Returns(404).Description("Not Found")
  deleteReservation(): Reservation {
    return {
      id: Math.floor(200),
      building: {
        id: 6,
        name: `building 6`
      },
      room: {
        id: 2,
        name: `room 2`
      },
      desk: {
        id: 4,
        name: `desk 4`
      },
      startTime: new Date(),
      endTime: new Date(),
      reserved_for: {
        id: 1,
        first_name: "JJ",
        last_name: "Johnson",
        company: "NB Electronics"
      }
    }
  }
}
