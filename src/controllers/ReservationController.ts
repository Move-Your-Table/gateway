import { Controller } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Description, Get, Patch, Post, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "src/models/Reservation/Reservation";
import ReservationConstructor from "src/models/Reservation/ReservationConstructor";
import ReservationMutator from "src/models/Reservation/ReservationMutator";

@Controller("/reservations")
@Docs("admin-api", "general-api")
@Tags("Reservations")
export class ReservationController {
  @Post("/")
  @Summary("Make a reservation for a 🔑-identified desk/room")
  @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(403).Description("Not Found")
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
  @Summary("Edit a 🔑-identified reservation")
  @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(403).Description("Not Found")
  editReservation(@BodyParams() payload: ReservationMutator, @PathParams("reservationId") rId:number): Reservation {
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
}

  

