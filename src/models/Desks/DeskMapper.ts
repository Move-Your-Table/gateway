import MaskedReservation from "../Reservation/MaskedReservation";
import Desk from "./Desk";

export default class DeskMapper {
    static mapDesk(bId: string, rId: string, desk: any): Desk<MaskedReservation> {
        return {
            id: desk.name,
            name: desk.name,
            buildingId: bId,
            roomId: rId,
            incidents: desk.incidentReports.length,
            reservations: desk.bookings.map((booking) => {
                return {
                    id: Math.floor(200),
                    room: {
                        id: rId,
                        name: `R&D Room`
                    },
                    building: {
                        id: bId,
                        name: `The Spire`
                    },
                    desk: {
                        id: Math.floor(200),
                        name: `Desk ${Math.floor(200)}`
                    },
                    startTime: new Date(),
                    endTime: new Date()
                }
            }),
            type: "Normal Desk",
            capacity: 1,
            floor: 1,
            features: [
                "Just a plain old desk"
            ]
        }
    }
}
