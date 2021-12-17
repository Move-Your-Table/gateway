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
  @Summary("Make a reservation for a 🔑-identified desk/room")
  @Description("- When the desk-Id is undefined, null or not given, the room will be reserved. \n - For date, you can use a ECMAScript Date object and parse this to a string, we'll handle the rest.")
  @Returns(200, Reservation)
  @Returns(400).Description("Bad Request")
  @Returns(404).Description("Not Found")
  createReservation(@BodyParams() payload: ReservationConstructor): Reservation {
    return {
      id: Math.floor(200).toString(),
      building: {
        id: payload.buildingId,
        name: `building ${payload.buildingId}`
      },
      room: {
        id: payload.roomName,
        name: `room ${payload.roomName}`
      },
      desk: (payload.deskName)
        ? {
          id: payload.deskName,
          name: `desk ${payload.deskName}`
        }
        : undefined,
      startTime: new Date(),
      endTime: new Date(),
      reserved_for: {
        id: "1",
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
  editReservation(@BodyParams() payload: ReservationMutator, 
  @PathParams("reservationId") rId: string): Reservation {
    return {
      id: rId,
      building: {
        id: payload.buildingId,
        name: (payload.buildingId) ? "Changed name" : "Unchanged name"
      },
      room: {
        id: payload.roomName,
        name: (payload.roomName) ? "Changed name" : "Unchanged name"
      },
      desk: (payload.deskName)
        ? {
          id: payload.deskName,
          name: `desk ${payload.deskName}`
        }
        : undefined,
      startTime: new Date(payload.startTime) || new Date(),
      endTime: new Date(payload.endTime) || new Date(),
      reserved_for: {
        id: "1",
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
      id: Math.floor(200).toString(),
      building: {
        id: "6",
        name: `building 6`
      },
      room: {
        id: "2",
        name: `room 2`
      },
      desk: {
        id: "4",
        name: `desk 4`
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
  }
}
