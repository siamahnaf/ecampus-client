import { useState, useRef } from "react";

//Hooks
import { useOutsideClick } from "@/Utilis/hook";

const options = [
    { value: "en", label: "English" },
    { value: "bn", label: "Bangla" },
]

//Types
interface Options {
    value: string;
    label: string;
}

const Select = () => {
    //Hook Initializing
    const ref = useRef(null);

    //State
    const [value, setValue] = useState<string>("en");
    const [open, setOpen] = useState(false);

    //Use Click outside
    useOutsideClick(ref, () => {
        setOpen(false)
    });

    //Handle Change
    const handleChange = (item: Options) => {
        setValue(item.value);
        setOpen(false);
    }
    return (
        <div className="relative" ref={ref}>
            <div className="bg-textColor bg-opacity-5 flex items-center w-full cursor-pointer py-[7px] rounded-3xl pl-6 pr-4 select-none" onClick={() => setOpen(!open)}>
                <p className="text-sm font-medium flex-1">{options.find((item) => item.value === value)?.label}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={`inline ${open ? "-rotate-180" : ""} transition-all duration-300 ease-in-out`}><path fill="currentColor" d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z" /></svg>
            </div>
            <ul className={`absolute left-0 w-full top-full mt-1 transition-all duration-300 ease-in-out ${open ? "opacity-1 visible translate-y-0" : "opacity-0 invisible -translate-y-1 "} bg-white shadow-lg px-1.5 max-h-40 overflow-auto scrollbar-none rounded-lg py-2 z-50`}>
                {options.map((item, i) => (
                    <li key={i} className={`my-2 px-2 py-0.5 rounded hover:bg-blue-gray-50 cursor-pointer ${item.value == "bn" && "opacity-40 pointer-events-none"}`} onClick={() => handleChange(item)}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Select;