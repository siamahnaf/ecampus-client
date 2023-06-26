import { useState, useContext } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

//Components
import Pagination from "@/Components/Common/Pagination";
import Header from "./Header";
import Details from "./Details";

//Context
import { PaginationContext } from "@/Context/pagination.context";

//Urql
import { useQuery } from "urql";
import { GET_COMPLAIN_LIST } from "@/Urql/Query/Complain/complain.query";
import { GetComplainData } from "@/Urql/Types/Complain/complain.types";

const Lists = () => {
    //State
    const [detail, setDetail] = useState<number | null>(null);

    //Context
    const { variables, setVariables, policy, setPolicy } = useContext(PaginationContext);

    //Urql
    const [{ data, error, fetching }, refetch] = useQuery<GetComplainData>({
        query: GET_COMPLAIN_LIST,
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
                            <th className="bg-primary capitalize text-main font-medium">Status</th>
                            <th className="bg-primary capitalize text-main font-medium">Date</th>
                            <th className="bg-primary capitalize text-main font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getComplains.results.map((item, i) => (
                            <tr key={i}>
                                <td>{item.title}</td>
                                <td className={`capitalize font-medium ${item.status === "pending" ? "text-amber-400" : item.status === "solve" ? "text-main" : "text-red-600"}`}>{item.status}</td>
                                <td>{dayjs(item.created_at).format("DD MMMM YYYY")}</td>
                                <td className="text-center">
                                    <div className="tooltip" data-tip="Edit">
                                        <button className="text-blue-600" onClick={() => setDetail(i)}>
                                            <Icon icon="mingcute:eye-2-fill" className="text-xl" />
                                        </button>
                                        <Details
                                            open={detail === i}
                                            onClose={() => setDetail(null)}
                                            defaultValue={item}
                                            refetch={refetch}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {data?.getComplains.results.length === 0 && !variables.search &&
                            <tr>
                                <td colSpan={4} className="text-center text-main font-medium text-base py-4">
                                    No complain data found!
                                </td>
                            </tr>
                        }
                        {data?.getComplains.results.length === 0 && variables.search &&
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
                        setVariables?.(prev => ({ ...prev, page: data?.getComplains.meta.currentPage as number + 1 }))
                    }}
                    onPrevClick={() => {
                        setPolicy?.("network-only")
                        setVariables?.(prev => ({ ...prev, page: data?.getComplains.meta.currentPage as number - 1 }))
                    }}
                    onSetPage={(e) => setVariables?.(prev => ({ ...prev, page: e }))}
                    meta={data?.getComplains.meta}
                />
            </div>
        </div>
    );
};

export default Lists;