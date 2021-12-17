import IncidentReport from "../IncidentReport/IncidentReport";
import IncidentReportMapper from "../IncidentReport/IncidentReportMapper";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import ReservationMapper from "../Reservation/ReservationMapper";
import Room from "./Room";

export default class RoomMapper {
    // Map GraphQL room to the correct format for the API
    static mapRooms(building : any, detailedReservations : Boolean = false,
        incidentReports : Boolean = false) : Array<Room<MaskedReservation>> {
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
                reservations: new Array<MaskedReservation>()
            };

            if(incidentReports) {
                const mappedReports = room.incidentReports.map(IncidentReportMapper.mapIncidentReport);
                (mappedRoom as any).incidents = mappedReports;
            }

            // This should be done by seperate classes later (DeskMapper and RoomMapper)
            room.desks.forEach((desk : any) => {
                desk.bookings.forEach((booking : any) => {
                    mappedRoom.reservations
                    .push(ReservationMapper.mapReservation(building, room, desk, booking, detailedReservations));
                });
            });

            rooms.push(mappedRoom);
        });

        return rooms;
    }
}
  