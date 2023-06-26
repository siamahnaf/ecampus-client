import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { Icon } from "@iconify/react";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    jsonData: Array<any>;
}

const Preview = ({ open, onClose, jsonData }: Props) => {
    return (
        <div>
            <Dialog
                open={open}
                handler={onClose}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: -15 },
                }}
                size="xl"
                style={{ fontFamily: inter.style.fontFamily }}
                className="rounded-lg"
            >
                <DialogBody className="text-textColor">
                    <div className="text-right mb-3">
                        <button className="bg-red-600 bg-opacity-20 p-1.5 rounded" onClick={onClose}>
                            <Icon className="text-xl text-red-600" icon="iconamoon:close-duotone" />
                        </button>
                    </div>
                    <div className="overflow-auto h-[450px]">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th className="bg-primary normal-case text-main font-medium">studentId</th>
                                    <th className="bg-primary normal-case text-main font-medium">class</th>
                                    <th className="bg-primary normal-case text-main font-medium">section</th>
                                    <th className="bg-primary normal-case text-main font-medium">group</th>
                                    <th className="bg-primary normal-case text-main font-medium">shift</th>
                                    <th className="bg-primary normal-case text-main font-medium">image</th>
                                    <th className="bg-primary normal-case text-main font-medium">name</th>
                                    <th className="bg-primary normal-case text-main font-medium">roll</th>
                                    <th className="bg-primary normal-case text-main font-medium">session</th>
                                    <th className="bg-primary normal-case text-main font-medium">gender</th>
                                    <th className="bg-primary normal-case text-main font-medium">dob</th>
                                    <th className="bg-primary normal-case text-main font-medium">blood</th>
                                    <th className="bg-primary normal-case text-main font-medium">religion</th>
                                    <th className="bg-primary normal-case text-main font-medium">number</th>
                                    <th className="bg-primary normal-case text-main font-medium">email</th>
                                    <th className="bg-primary normal-case text-main font-medium">fee_start</th>
                                    <th className="bg-primary normal-case text-main font-medium">admissionDate</th>
                                    <th className="bg-primary normal-case text-main font-medium">birthCertificate</th>
                                    <th className="bg-primary normal-case text-main font-medium">fatherName</th>
                                    <th className="bg-primary normal-case text-main font-medium">fatherNidNumber</th>
                                    <th className="bg-primary normal-case text-main font-medium">fatherPhone</th>
                                    <th className="bg-primary normal-case text-main font-medium">motherName</th>
                                    <th className="bg-primary normal-case text-main font-medium">motherNidNumber</th>
                                    <th className="bg-primary normal-case text-main font-medium">motherPhone</th>
                                    <th className="bg-primary normal-case text-main font-medium">guardianName</th>
                                    <th className="bg-primary normal-case text-main font-medium">guardianNidNumber</th>
                                    <th className="bg-primary normal-case text-main font-medium">guardianPhone</th>
                                    <th className="bg-primary normal-case text-main font-medium">address</th>
                                    <th className="bg-primary normal-case text-main font-medium">school</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.studentId}</td>
                                        <td>{item.class}</td>
                                        <td>{item.section}</td>
                                        <td>{item.group}</td>
                                        <td>{item.shift}</td>
                                        <td>{item.image}</td>
                                        <td>{item.name}</td>
                                        <td>{item.roll}</td>
                                        <td>{item.session}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.dob}</td>
                                        <td>{item.blood}</td>
                                        <td>{item.religion}</td>
                                        <td>{item.number}</td>
                                        <td>{item.email}</td>
                                        <td>{item.fee_start}</td>
                                        <td>{item.admissionDate}</td>
                                        <td>{item.birthCertificate}</td>
                                        <td>{item.fatherName}</td>
                                        <td>{item.fatherNidNumber}</td>
                                        <td>{item.fatherPhone}</td>
                                        <td>{item.motherName}</td>
                                        <td>{item.motherNidNumber}</td>
                                        <td>{item.motherPhone}</td>
                                        <td>{item.guardianName}</td>
                                        <td>{item.guardianNidNumber}</td>
                                        <td>{item.guardianPhone}</td>
                                        <td>{item.address}</td>
                                        <td>{item.school}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-5">
                        <Button color="green" className="bg-main py-2.5 px-5">
                            Save Student
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default Preview;