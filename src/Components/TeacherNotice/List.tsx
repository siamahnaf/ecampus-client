import { useState, useContext } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

//Components
import Pagination from "@/Components/Common/Pagination";
import Header from "@/Components/Notice/Header";
import View from "@/Components/Notice/View";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery } from "urql";
import { GET_NOTICE } from "@/Urql/Query/Notice/notice.query";
import { GetNoticeData } from "@/Urql/Types/Notice/notice.types";

const List = () => {
    //State
    const [view, setView] = useState<string | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error }] = useQuery<GetNoticeData>({
        query: GET_NOTICE,
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
                            <th className="bg-primary capitalize text-main font-medium">Date</th>
                            <th className="bg-primary capitalize text-main font-medium">Subject</th>
                            <th className="bg-primary capitalize text-main font-medium">Created By</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getNotices.results.map((item, i) => (
                            <tr key={i}>
                                <td>{dayjs(item.created_at).format("DD-MMM-YYYY")}</td>
                                <td>{item.title}</td>
                                <td>{item.createdBy?.name || ("+" + item.createdBy?.phone)}</td>
                                <td className="flex gap-3 justify-center">
                                    <div className="tooltip" data-tip="View">
                                        <button className="text-main" onClick={() => setView(item.id)}>
                                            <Icon icon="ri:eye-fill" className="text-xl" />
                                        </button>
                                        <View
                                            open={item.id === view}
                                            onClose={() => setView(null)}
                                            defaultValue={item}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getNotices.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    No notice data found!
                                </td>
                            </tr>
                        }
                        {data?.getNotices.results.length === 0 && variables.search &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    Nothing found with &quot;{variables.search}&quot;
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
                        setVariables?.(prev => ({ ...prev, page: data?.getNotices.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getNotices.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getNotices.meta}
                />
            </div>
        </div>
    );
};

export default List;