export default interface Building {
  id: number;
  name: string;
  street: string;
  city: string;
  postcode: number;
  rooms: Rooms;
  desks: Desks;
}

interface Rooms {
  total: number;
  free: number;
}

interface Desks {
  total: number;
  free: number;
}
