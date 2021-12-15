import MaskedReservation from "../Reservation/MaskedReservation";
import Room from "./Room";

export default class RoomMapper {
    // Map GraphQL room to the correct format for the API
    static mapRoomsWithMaskedReservations(building : any) : Array<Room<MaskedReservation>> {
        const rooms = Array<Room<MaskedReservation>>();

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
                    mappedRoom.reservations.push({
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
                    });
                });
            });

            rooms.push(mappedRoom);
        });

        return rooms;
    }
}
  