import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import Room from "./Room";

export default class RoomMapper {
    // Map GraphQL room to the correct format for the API
    static mapRooms(building : any, detailedReservations=false) : Array<Room<MaskedReservation>> {
        const rooms = Array<Room<MaskedReservation | Reservation>>();

        building.rooms.forEach((room : any) => {
            const mappedRoom = {
                name: room.name,
                type: room.type,
                features: room.features,
                capacity: room.desks.length,
                floor: room.floor,
                id: room.name,
                buildingId: building._id,
                incidents: room.incidentReports.length,
                reservations: new Array<MaskedReservation>()
            };

            // This should be done by seperate classes later (DeskMapper and RoomMapper)
            room.desks.forEach((desk : any) => {
                desk.bookings.forEach((booking : any) => {
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
                        endTime: booking.end_time,
                        reserved_for: {
                            id: booking.user._id,
                            first_name: booking.user.first_name,
                            last_name: booking.user.last_name,
                            company: booking.user.company
                        }
                    };

                    mappedRoom.reservations.push(reservation);
                });
            });

            rooms.push(mappedRoom);
        });

        return rooms;
    }
}
  