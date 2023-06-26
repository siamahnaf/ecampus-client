//Component
import ExportTable from "@/Components/Common/ExportTable";

//Urql
import { useQuery } from "urql";
import { GET_EXPORT_NOTIFICATION } from "@/Urql/Query/Communication/notification.query";
import { GetExportNotifyData } from "@/Urql/Types/Communication/notification.types";

const Header = () => {
    //Urql
    const [{ data }] = useQuery<GetExportNotifyData>({ query: GET_EXPORT_NOTIFICATION });

    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Notification List</p>
                <div className="flex-1 text-right">
                    <ExportTable
                        data={data?.getAllNotificationsWithoutPagination.map((item) => ({ title: item.title, sendBy: item.senderId.name || item.senderId.phone, receiverType: item.type })) as Array<any>}
                        headers={["Section Name", "Send By", "Receivers Type"]}
                        fileName="Notification List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;