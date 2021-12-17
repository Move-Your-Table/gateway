import { Controller } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Minimum, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "../models/Reservation/Reservation";
import ReservationConstructor from "../models/Reservation/ReservationConstructor";
import ReservationMutator from "../models/Reservation/ReservationMutator";
import { gql } from "graphql-request";
import GraphQLService from "src/services/GraphQlService";

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
  async CreateReservation(@BodyParams() payload: ReservationMutator): Promise<ReservationConstructor> {
    console.log("START");
    const query = gql`
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
    // console.log(query);

    const bookingInput = {
      user_id: payload.userId,
      start_time: payload.startTime,
      end_time: payload.endTime,
      public: true,
    }
    console.log("INPUT", bookingInput);
    const result = await GraphQLService.request(query, {id:payload.buildingId, roomName: payload.roomId, deskName: payload.deskId, bookingInput: bookingInput});
    const reservation = result.addBookingToDesk as any;
    console.log("RESERVATION", reservation);
    return {
      userId: reservation.user._id,
      buildingId: reservation._id,
      startTime: reservation.start_time,
      endTime: reservation.end_time,
      roomId: reservation
    };
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
