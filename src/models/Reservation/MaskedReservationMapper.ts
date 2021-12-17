import MaskedReservation from "./MaskedReservation"

export default class MaskedReservationMapper { 
    static mapReservation (
        bId: string,
        rId: string,
        dId: string,
        reservation: any,
        bName: string = bId,
        rName: string = rId,
        dName: string = dId): MaskedReservation { 
        return {
            id: reservation._id,
            room: {
                id: rId,
                name: rName
            },
            building: {
                id: bId,
                name: bName
            },
            desk: {
                id: dId,
                name: dName
            },
            startTime: new Date(reservation.start_time),
            endTime: new Date(reservation.end_time)
        }
    }
}
