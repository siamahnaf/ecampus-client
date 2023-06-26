import { Dialog, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { Icon } from "@iconify/react";

//Urql
import { NoticeData } from "@/Urql/Types/Notice/notice.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: NoticeData
}

const View = ({ open, onClose, defaultValue }: Props) => {
    return (
        <div>
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
                <DialogBody className="py-8 px-10 text-black">
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <div>
                            <Image src="/images/logo.png" alt="Logo" width={120} height={89} style={{ width: "100px" }} />
                        </div>
                        <div className="text-left w-max ml-auto">
                            <p className="text-sm font-medium">E-Campus</p>
                            <p className="text-sm">+8801611994403</p>
                            <p className="text-sm">info@ecampus.edu.bd</p>
                            <p className="text-sm w-max">192, central road, Kamrangir char, dhaka</p>
                        </div>
                    </div>
                    <div className="mt-6 overflow-auto max-h-[320px] pr-3 scrollbar-thin scrollbar-thumb-[#c1c1c1] scrollbar-thumb-rounded-md">
                        <h6 className="font-semibold text-[15px]">Subject: {defaultValue.title}</h6>
                        {defaultValue.pdf &&
                            <p className="mt-2 font-medium">
                                <Icon className="inline text-main text-2xl mb-1" icon="material-symbols:attach-file" />
                                1 attached file <Link href={process.env.NEXT_PUBLIC_IMAGE_URL + defaultValue.pdf} target="_blank" className="text-main font-bold">download</Link></p>
                        }
                        <p className="my-6 whitespace-pre-wrap">
                            {defaultValue.description}
                        </p>
                        <p className="text-sm">Date: {dayjs(defaultValue.created_at).format("DD-MMM-YYYY")}</p>
                    </div>
                </DialogBody>
                <DialogFooter className="flex gap-3">
                    <Button variant="outlined" color="green" size="sm" onClick={onClose}>Close</Button>
                    {defaultValue.pdf &&
                        <Link href={process.env.NEXT_PUBLIC_IMAGE_URL + defaultValue.pdf} target="_blank">
                            <Button color="green" size="sm" className="bg-main px-6" type="submit">Download</Button>
                        </Link>
                    }
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default View;