import { Success, Meta } from "../success.types";

//Add Room
export interface AddRoomsData {
    addRoom: Success
}

//Room Data
export interface RoomsData {
    id: string;
    room_no: string;
    capacity: number;
    createdBy: {
        name: string;
        phone: string;
    }
}

//Get rooms data
export interface GetRoomsListData {
    getRooms: {
        results: RoomsData[];
        meta: Meta;
    }
}

//Get All Room Data
export interface GetAllRoomData {
    getAllRoom: RoomsData[];
}

//Delete rooms data
export interface DeleteRoomsData {
    deleteRoom: Success
}

//Update rooms data
export interface UpdateRoomsData {
    updateRoom: Success
}