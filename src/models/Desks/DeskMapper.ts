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
            reservations: desk.bookings.map((booking: any) => {
                return {
                    id: booking._id,
                    room: {
                        id: rId,
                        name: rId
                    },
                    building: {
                        id: bId,
                        name: bId
                    },
                    desk: {
                        id: desk.name,
                        name: desk.name
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
