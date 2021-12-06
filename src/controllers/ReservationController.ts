import { Controller } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Description, Get, Post, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "src/models/Reservation/Reservation";
import ReservationConstructor from "src/models/Reservation/ReservationConstructor";

@Controller("/reservations")
@Docs("admin-api", "general-api")
@Tags("Reservations")
export class ReservationController {
  @Post("/")
  @Summary("Make a reservation for a 🔑-identified desk/room")
  @Description("- When the deskId is undefined, null or not given, the room will be reserved. \n - For date, you can use a EMCAScript Date object and parse this to a string")
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
}
