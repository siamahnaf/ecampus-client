import { useContext, ChangeEvent } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

//Component
import ExportTable from "@/Components/Common/ExportTable";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery } from "urql";
import { GET_ALL_NOTICE } from "@/Urql/Query/Notice/notice.query";
import { GetAllNoticeData } from "@/Urql/Types/Notice/notice.types";

const Header = () => {
    //Urql
    const [{ data }] = useQuery<GetAllNoticeData>({ query: GET_ALL_NOTICE });

    //Context
    const { setVariables } = useContext(PaginationContext);

    //OnChange Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVariables?.(prev => ({ ...prev, search: e.target.value }));
    }
    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Notice List</p>
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
                        data={data?.getAllNotice.map((item) => ({
                            name: dayjs(item.created_at).format("DD-MMM-YYYY"),
                            subject: item.title,
                            createdBy: item.createdBy.name || item.createdBy.phone
                        })) as Array<any>}
                        headers={["Date", "Subject", "Created By"]}
                        fileName="Notice List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;