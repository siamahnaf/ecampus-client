import { useContext, useState } from "react";
import { Icon } from "@iconify/react";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Components
import Pagination from "@/Components/Common/Pagination";
import Header from "./Header";
import Details from "./Details";

//Urql
import { useQuery } from "urql";
import { GET_ALL_NOTIFICATIONS } from "@/Urql/Query/Communication/notification.query";
import { GetAllNotifyData } from "@/Urql/Types/Communication/notification.types";

const Lists = () => {
    //State
    const [detail, setDetail] = useState<number | null>(null);

    //Context
    const { setVariables, variables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error }] = useQuery<GetAllNotifyData>({
        query: GET_ALL_NOTIFICATIONS,
        variables: { searchInput: variables },
        requestPolicy: policy
    });

    return (
        <div className="mb-8">
            <Header />
            <div className="mt-8 overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th className="bg-primary capitalize text-main font-medium">Title</th>
                            <th className="bg-primary capitalize text-main font-medium">Send By</th>
                            <th className="bg-primary capitalize text-main font-medium">Receivers Type</th>
                            <th className="bg-primary capitalize text-main font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getAllNotifications.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.title}</td>
                                <td>{item.senderId?.name || ("+" + item.senderId?.phone)}</td>
                                <td className="capitalize">{item.type}</td>
                                <td className="flex gap-3">
                                    <div className="tooltip" data-tip="Details">
                                        <button className="text-blue-600" onClick={() => setDetail(i)}>
                                            <Icon icon="mingcute:eye-2-fill" className="text-xl" />
                                        </button>
                                        <Details
                                            open={detail === i}
                                            onClose={() => setDetail(null)}
                                            defaultValue={item}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getAllNotifications.results.length === 0 &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    No notification data found!
                                </td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    {error?.message}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="mt-5">
                <Pagination
                    onNextClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getAllNotifications.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getAllNotifications.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getAllNotifications.meta}
                />
            </div>
        </div>
    );
};

export default Lists;