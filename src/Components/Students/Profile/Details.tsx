import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";

//Urql
import { useQuery } from "urql";
import { GET_SINGLE_STUDENT } from "@/Urql/Query/Students/student.query";
import { GetSingleStudentData } from "@/Urql/Types/Students/student.types";


const Details = () => {
    //Initialize Hooks
    const router = useRouter();

    //Urql
    const [{ data, error }] = useQuery<GetSingleStudentData>({ query: GET_SINGLE_STUDENT, variables: { getStudentId: router.query.id } });


    if (error) return <h4 className="text-center mt-5 text-red-600 font-medium">{error.message}</h4>

    return (
        <div>
            <h2 className="text-base font-semibold my-4 uppercase">Student Info</h2>
            <div className="flex gap-3 border border-dashed border-textColor border-opacity-30 rounded-lg p-4">
                <div className="basis-[15%]">
                    {data?.getStudent?.image ? (
                        <Image src={process.env.NEXT_PUBLIC_IMAGE_URL + data.getStudent.image} alt={data.getStudent.name} width={132} height={170} className="w-full h-full rounded-lg" />
                    ) : (
                        <Image src="/images/placeholder-women.png" alt="placeholder" width={132} height={170} className="w-full h-full rounded-lg" />
                    )}
                </div>
                <div className="basis-[85%]">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-main font-semibold">Student Name</td>
                                        <td>{data?.getStudent.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Student Id</td>
                                        <td>{data?.getStudent.studentId}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Roll</td>
                                        <td>{data?.getStudent.roll}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Session</td>
                                        <td>{data?.getStudent.session}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-main font-semibold">Class</td>
                                        <td>{data?.getStudent?.class.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Shift</td>
                                        <td>{data?.getStudent?.shift?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Section</td>
                                        <td>{data?.getStudent?.section?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-main font-semibold">Group</td>
                                        <td>{data?.getStudent?.group?.name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="text-base font-semibold my-4 uppercase">Personal Information</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <tbody>
                        <tr>
                            <td className="opacity-80 text-sm">Admission Date</td>
                            <td className="opacity-80 text-sm">{dayjs(data?.getStudent.admissionDate).format("DD MMM YYYY")}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Date Of Birth</td>
                            <td className="opacity-80 text-sm">{dayjs(data?.getStudent.dob).format("DD MMM YYYY")}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Religion</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.religion}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Gender</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.gender}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Blood Group</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.blood}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Number</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.number}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Email</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.email}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Birth Certificate</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.birthCertificate}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Fee Start</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.fee_start}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">Address</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.address}</td>
                        </tr>
                        <tr>
                            <td className="opacity-80 text-sm">School Name</td>
                            <td className="opacity-80 text-sm">{data?.getStudent?.school}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2 className="text-base font-semibold my-4 uppercase">Parent & Guardian Details</h2>
            <div className="flex gap-3 item-center mb-5">
                <div className="basis-[12%]">
                    <Image src="/images/placeholder-women.png" alt="placeholder" width={132} height={170} className="w-full h-full rounded-lg" />
                </div>
                <div className="basis-[88%]">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <tbody>
                                <tr>
                                    <td className="opacity-80 text-sm">Father Name</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.fatherName}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">NID</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.fatherNidNumber}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">Phone Number</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.fatherPhone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 item-center mb-5">
                <div className="basis-[12%]">
                    <Image src="/images/placeholder-women.png" alt="placeholder" width={132} height={170} className="w-full h-full rounded-lg" />
                </div>
                <div className="basis-[88%]">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <tbody>
                                <tr>
                                    <td className="opacity-80 text-sm">Mother Name</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.motherName}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">NID</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.motherNidNumber}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">Phone Number</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.motherPhone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 item-center mb-8">
                <div className="basis-[12%]">
                    <Image src="/images/placeholder-women.png" alt="placeholder" width={132} height={170} className="w-full h-full rounded-lg" />
                </div>
                <div className="basis-[88%]">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <tbody>
                                <tr>
                                    <td className="opacity-80 text-sm">Guardian Name</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.guardianName}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">NID</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.guardianNidNumber}</td>
                                </tr>
                                <tr>
                                    <td className="opacity-80 text-sm">Phone Number</td>
                                    <td className="opacity-80 text-sm">{data?.getStudent?.guardianPhone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;