import { Controller } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Minimum, Patch, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "../models/Reservation/Reservation";
import ReservationConstructor from "../models/Reservation/ReservationConstructor";
import ReservationMutator from "../models/Reservation/ReservationMutator";

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
        buildingId: i + 2,
        roomId: i + 3,
        deskId: i + 4,
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
  @Summary("Make a reservation for a 🔑-identified desk/room")
  @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(404).Description("Not Found")
  createReservation(@BodyParams() payload: ReservationConstructor): Reservation {
    return {
      id: Math.floor(200),
      buildingId: payload.buildingId,
      roomId: payload.roomId,
      deskId: payload.deskId,
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

  @Patch("/:reservationId")
  @Summary("Edit a 🔑-identified reservation 🥽")
  @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(404).Description("Not Found")
  editReservation(@BodyParams() payload: ReservationMutator, @PathParams("reservationId") rId: number): Reservation {
    return {
      id: rId,
      buildingId: payload.buildingId || 0,
      roomId: payload.roomId || 0,
      deskId: payload.deskId || 0,
      startTime: new Date(payload.startTime) || new Date(),
      endTime: new Date(payload.endTime) || new Date(),
      reserved_for: {
        id: 1,
        first_name: "JJ",
        last_name: "Johnson",
        company: "NB Electronics"
      }
    }
  }

  @Delete("/:reservationId")
  @Summary("Delete a 🔑-identified reservation 🧨")
  @Returns(200, Reservation)
  @Returns(404).Description("Not Found")
  deleteReservation(): Reservation {
    return {
      id: Math.floor(200),
      buildingId: 1,
      roomId: 2,
      deskId: 6,
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
