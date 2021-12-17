import { Controller } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Description, Get, Minimum, Post, Required, Returns, Summary, Tags } from "@tsed/schema";
import { Docs } from "@tsed/swagger";
import Reservation from "../models/Reservation/Reservation";
import ReservationMutator from "../models/Reservation/ReservationMutator";
import DeleteReservationConstructor from "../models/Reservation/DeleteReservationConstructor";
import { gql } from "graphql-request";
import GraphQLService from "../services/GraphQLService";
import ReservationMapper from "../models/Reservation/ReservationMapper";
import MaskedReservation from "../models/Reservation/MaskedReservation";

@Controller("/reservations")
@Docs("admin-api", "general-api")
@Tags("Reservations")
export class ReservationController {
  @Get("/")
  @Summary("Get all reservations of a user")
  @Returns(200, Array).Of(Reservation)
  async getReservations(@QueryParams("userId") @Required() @Minimum(0) userId: string): Promise<Array<MaskedReservation | Reservation>> {
    const query = gql`
      query getReservations {
        buildings {
          _id
          name
          rooms {
            name
            desks {
              name
              bookings(user_id: "61ba0ac1ebca734c1827fbd4") {
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
    `

    const result = await GraphQLService.request(query, {user_id: userId});
    const buildingReservations = result.buildings as any;

    let reservations = [] as Array<MaskedReservation | Reservation>;
    buildingReservations.forEach((building: any) => {
      console.log("BUILD", building);
      building.rooms.forEach((room : any) => {
        console.log("ROOM", room);
        room.desks.forEach((desk : any) => {
          console.log("DESK", desk);
          desk.bookings.forEach((reservation : any) => {
            console.log("BOOKING", reservation);
            reservations.push(ReservationMapper.mapReservation(building, room, desk, reservation, true));
          });
        });
      });
    });
    return reservations;

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
