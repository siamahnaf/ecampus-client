import { useContext, ChangeEvent } from "react";
import { Icon } from "@iconify/react";

//Component
import ExportTable from "@/Components/Common/ExportTable";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery } from "urql";
import { GET_ALL_ROOM } from "@/Urql/Query/Academics/room.query";
import { GetAllRoomData } from "@/Urql/Types/Academics/room.types";

const Header = () => {
    //Urql
    const [{ data }] = useQuery<GetAllRoomData>({ query: GET_ALL_ROOM });

    //Context
    const { setVariables } = useContext(PaginationContext);

    //OnChange Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVariables?.(prev => ({ ...prev, search: e.target.value }));
    }

    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Class Room List</p>
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input w-full rounded-3xl input-sm bg-textColor bg-opacity-5 focus:outline-none pl-14 py-[18px]"
                        onChange={onChange}
                    />
                    <Icon icon="material-symbols:search" className="text-xl absolute top-2/4 left-6 -translate-y-2/4" />
                </div>
                <div className="flex-1 text-right">
                    <ExportTable
                        data={data?.getAllRoom.map((item) => ({ RoomNo: item.room_no, Capacity: item.capacity.toString(), createdBy: item.createdBy.name || item.createdBy.phone })) as Array<any>}
                        headers={["Room No", "Capacity", "Created By"]}
                        fileName="Room List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;