import { ReactNode, Fragment, useEffect } from "react";
import { Icon } from "@iconify/react";

//Interface
interface Props {
    open: boolean;
    handleClose: () => void;
    severity?: "error" | "success";
    children: ReactNode;
}

export const Notification = ({ open, handleClose, severity = "success", children }: Props) => {
    useEffect(() => {
        let timerId: number;
        if (open) {
            timerId = window.setTimeout(() => {
                handleClose();
            }, 6000);
        }
        return () => {
            clearTimeout(timerId);
        };
    }, [open, handleClose, children]);
    return (
        <Fragment>
            <div className={`fixed bottom-5 left-5 transition-all duration-300 ease-in-out z-50 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className={`flex items-center w-max py-2 px-3 rounded-md ${severity === "success" ? "bg-green-50" : "bg-red-50"}`}>
                    {severity === "success" ?
                        <Icon icon="ep:success-filled" className="inline mr-2 text-lg -mb-0.5 text-green-700" /> : <Icon icon="material-symbols:error-rounded" className="inline mr-2 text-lg text-red-600" />
                    }
                    <p className="text-sm max-w-[80%]">{children}</p>
                    <button className="p-0.5 text-xl rounded-full -mb-0.5 ml-2.5 hover:bg-black hover:bg-opacity-5 transition-all ease-in-out duration-200" onClick={handleClose}>
                        <Icon icon="ion:close" />
                    </button>
                </div>
            </div>
        </Fragment>
    );
};