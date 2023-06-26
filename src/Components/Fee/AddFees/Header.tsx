import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";

//Component
import ExportTable from "@/Components/Common/ExportTable";

//Urql
import { useQuery } from "urql";
import { GET_FEES_LIST } from "@/Urql/Query/Fee/fees.query";
import { GetFeesData } from "@/Urql/Types/Fee/fees.types";

//Interface
interface Props {
    value: string;
    setValue: Dispatch<SetStateAction<string>>
}

const Header = ({ value, setValue }: Props) => {
    //Urql
    const [{ data }] = useQuery<GetFeesData>({ query: GET_FEES_LIST, variables: { searchInput: { search: value } } });

    //OnChange Handler
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return (
        <div className="mt-8">
            <div className="flex gap-8 items-center">
                <p className="text-base uppercase font-semibold">Fees List</p>
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
                        data={data?.getFees.map((item) => ({
                            name: item.name,
                            class: item.class.name,
                            frequency: item.frequency,
                            amount: item.amount,
                            createdBy: item.createdBy.name || item.createdBy.phone
                        })) as Array<any>}
                        headers={["Name", "Class", "Frequency", "Amount", "Created By"]}
                        fileName="Fees List"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;