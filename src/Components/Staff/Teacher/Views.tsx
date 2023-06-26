import { Dialog, DialogBody, DialogFooter, DialogHeader, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { Icon } from "@iconify/react";

//Urql
import { TeacherData } from "@/Urql/Types/Staff/teacher.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    defaultValue: TeacherData
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
                <DialogHeader className="text-xl">
                    <div className="w-max ml-auto">
                        <button className="w-6 h-6 bg-red-50 rounded text-red-600 flex items-center justify-center" onClick={onClose}>
                            <Icon className="text-xl" icon="eva:close-fill" />
                        </button>
                    </div>
                </DialogHeader>
                <DialogBody className="px-0 text-textColor aspect-[82/45] max-h-full overflow-auto">
                    <div className="flex gap-4 items-center px-6 mb-6">
                        <div className="relative">
                            {defaultValue.image ? <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + defaultValue.image} alt="Profile" width={400} height={400} className="rounded-full w-[100px] h-[100px] object-cover object-top" /> : <Image src="/images/placeholder-women.png" alt="Profile" width={400} height={400} className="rounded-full w-[120px] h-[120px] object-cover object-top" />}
                            <p className="absolute bg-white text-main font-medium border border-solid border-textColor border-opacity-20 text-[10px] rounded-3xl px-2 py-0.5 left-1/2 -translate-x-1/2 -bottom-3">Teacher</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{defaultValue.name}</h3>
                            <p>#{defaultValue.id}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="flex gap-5">
                        <ul className="basis-1/2">
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Phone: </span>
                                <span className="font-semibold">+{defaultValue.phone}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Date Of Birth: </span>
                                <span className="font-semibold">{dayjs(defaultValue.dob).format("DD MMM YYYY")}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">NID: </span>
                                <span className="font-semibold">{defaultValue.nid}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Emergency Number: </span>
                                <span className="font-semibold">{defaultValue.emergencyPhone}</span>
                            </li>
                            <li className="py-3 px-6">
                                <span className="font-semibold opacity-40">Address: </span>
                                <span className="font-semibold">{defaultValue.address}</span>
                            </li>
                        </ul>
                        <ul className="basis-1/2">
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Email: </span>
                                <span className="font-semibold">{defaultValue.email}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Gender: </span>
                                <span className="font-semibold">{defaultValue.gender}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Education: </span>
                                <span className="font-semibold">{defaultValue.education}</span>
                            </li>
                            <li className="border-b border-solid border-textColor border-opacity-10 py-3 px-6">
                                <span className="font-semibold opacity-40">Salary: </span>
                                <span >{defaultValue.salary}</span>
                            </li>
                        </ul>
                    </div>
                    <hr />
                </DialogBody>
                <DialogFooter className="flex gap-3 items-center justify-start">
                    <div className="flex-1">
                        {defaultValue.document &&
                            <p className="font-medium">
                                <Icon className="inline text-main text-2xl mb-1" icon="material-symbols:attach-file" />
                                1 attached file <Link href={process.env.NEXT_PUBLIC_IMAGE_URL + defaultValue.document} target="_blank" className="text-main font-bold">download</Link>
                            </p>
                        }
                    </div>
                    <div>
                        <Button color="green" size="sm" className="focus:ring-0 bg-main" onClick={onClose}>Close</Button>
                    </div>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default View;