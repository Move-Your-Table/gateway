import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "./Reservation";

export default class ReservationMapper {
    // Map GraphQL reservation to the correct format for the API
    static mapReservation(building : any, room : any, desk : any, booking: any, detailedReservations : Boolean = false) : MaskedReservation | Reservation {
        const reservation = {
            building: {
                id: building._id,
                name: building.name
            },
            room: {
                id: 0,
                name: room.name
            },
            desk: {
                id: 0,
                name: desk.name
            },
            id: booking._id,
            startTime: booking.start_time,
            endTime: booking.end_time
        };

        if(detailedReservations) {
            (reservation as any).reserved_for = {
                id: booking.user._id,
                first_name: booking.user.first_name,
                last_name: booking.user.last_name,
                company: booking.user.company,
            }
        }

        return reservation;
    }
}
  