import {PathParams} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import Room from "src/models/Room/Room";

@Controller("/building/:buildingId/room")
export class RoomControllerController {
  @Get("/")
  @(Returns("200", Array).Of(Room))
  findAll(@PathParams("buildingId") id: number): Array<Room> {
    const json: Array<Room> = [];
    for (let i = 0; i < 10; i++) {
      const element = {
        id: i,
        buildingId: id,
        name: `R&D Room ${i}`,
        type: `R&D Room`,
        incidents: Math.floor(10),
        features: `<p>A fully-fledged R&D rooms that contains the following features:</p>
        <ul>
          <li>${i} workbenches</li>
          <li>${5 + i} PCs</li>
          <li>Excellent WI-Fi Access</li>
          <li>LAN ports through FireWire</li>
        </ul>`,
        reservations: [
          {
            id: Math.floor(200),
            roomId: i,
            deskId: undefined,
            dateTime: new Date()
          }
        ]
      };
      json.push(element);
    }
    return json;
  }
}
