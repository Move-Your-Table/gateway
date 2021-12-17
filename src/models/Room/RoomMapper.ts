import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import ReservationMapper from "../Reservation/ReservationMapper";
import Room from "./Room";

export default class RoomMapper {
    // Map GraphQL room to the correct format for the API
    static mapRooms(building : any, detailedReservations : Boolean = false) : Array<Room<MaskedReservation>> {
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
                    mappedRoom.reservations
                    .push(ReservationMapper.mapReservation(building, room, desk, booking));
                });
            });

            rooms.push(mappedRoom);
        });

        return rooms;
    }
}
  