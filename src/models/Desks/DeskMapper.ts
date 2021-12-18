import IncidentReportMapper from "../IncidentReport/IncidentReportMapper";
import MaskedReservation from "../Reservation/MaskedReservation";
import Reservation from "../Reservation/Reservation";
import ReservationMapper from "../Reservation/ReservationMapper";
import Desk from "./Desk";

export default class DeskMapper {
    // Map GraphQL desk to the correct format for the API
    static mapDesks(building : any, 
        detailedReservations : Boolean = false,
        incidentReports : Boolean = false) : Array<Desk<MaskedReservation>> {
        let desks = Array<Desk<MaskedReservation | Reservation>>();

        // Put all the desks of every room into the desks array
        building.rooms.forEach((room : any) => {
            const roomDesks = room.desks.map((desk: any) => {
                const mappedDesk = {
                    deskName: desk.name,
                    type: "normal",
                    features: desk.features,
                    capacity: room.deskCount,
                    floor: room.floor,
                    buildingId: building._id,
                    roomId: room.name,
                    incidents: desk.incidentReports.length,
                    reservations: new Array<MaskedReservation>()
                };

                // Add incidentreports if required
                if(incidentReports) {
                    const mappedReports = desk.incidentReports.map(IncidentReportMapper.mapIncidentReport);
                    (mappedDesk as any).incidents = mappedReports;
                }


                // Add reservations
                desk.bookings.forEach((booking : any) => {
                    mappedDesk.reservations
                    .push(ReservationMapper.mapReservation(building, room, desk, booking, detailedReservations));      
                });
                
                return mappedDesk;
            });
            desks = desks.concat(roomDesks);
        });
        return desks;
    }
}
  