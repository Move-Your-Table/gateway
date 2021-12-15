import Building from "./Building";

export default class BuildingMapper {
    // Map GraphQL building to the correct format for the API
    static mapBuilding(building : any) {
        return {
            street: building.address.street,
            city: building.address.city,
            postcode: building.address.postalcode,
            country: building.address.country,
            name: building.name,
            id: building._id,
            name2: "Joe"
          }
    }
}
  