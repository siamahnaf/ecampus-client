import { Dialog, DialogBody } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { Icon } from "@iconify/react";
import Image from "next/image";
import dayjs from "dayjs";

//Urql
import { ALlNotificationData } from "@/Urql/Types/Communication/notification.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: ALlNotificationData;
}

const Details = ({ open, onClose, defaultValue }: Props) => {
    return (
        <Dialog
            open={open}
            handler={onClose}
            animate={{
                mount: { y: 0 },
                unmount: { y: -15 },
            }}
            size="lg"
            style={{ fontFamily: inter.style.fontFamily }}
            className="rounded-lg"
        >
            <DialogBody className="text-textColor">
                <div className="flex gap-3 pb-3">
                    <div className="flex-1">
                        <h4 className="font-medium text-xl">{defaultValue.title}</h4>
                    </div>
                    <div>
                        <button className="bg-red-100 w-6 h-6 rounded flex items-center justify-center" onClick={onClose}>
                            <Icon className="text-xl text-red-600" icon="ic:round-close" />
                        </button>
                    </div>
                </div>
                <hr />
                <p className="my-2 font-medium">{defaultValue.details}</p>
                {defaultValue.image &&
                    <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + defaultValue.image} alt={defaultValue.title} width={800} height={300} className="rounded-lg w-full" />
                }
                <div className="mt-3 flex gap-9 opacity-50 pb-4">
                    <div className="flex gap-2 items-center">
                        <Icon icon="streamline:interface-calendar-check-approve-calendar-check-date-day-month-success" className="text-lg" />
                        <p>Publish Date: {dayjs(defaultValue.created_at).format("DD/MM/YYYY")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon className="text-2xl" icon="material-symbols:person" />
                        <p>Created By: {defaultValue.senderId.name || defaultValue.senderId.phone}</p>
                    </div>
                </div>
                <hr />
                <div className="pt-3">
                    <h4 className="text-lg font-semibold mb-3"> Sent To</h4>
                    {defaultValue.type === "role" ? (
                        <p className="capitalize font-medium text-base opacity-60">{defaultValue.receivers.map((item => item.to)).join(", ")}</p>
                    ) : (
                        <p className="capitalize font-medium text-base opacity-60">{defaultValue.type}</p>
                    )}
                </div>
            </DialogBody>
        </Dialog>
    );
};

export default Details;