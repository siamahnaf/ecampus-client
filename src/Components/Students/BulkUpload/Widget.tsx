import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { Icon } from "@iconify/react";
import { ExportAsExcel, ExcelToJsonConverter } from "react-export-table";

//Components
import Preview from "./Preview";

//Graphql
import { useQuery } from "urql";
import { GET_ALL_CLASS } from "@/Urql/Query/Academics/class.query";
import { GetAllClassData } from "@/Urql/Types/Academics/class.types";

//Notes Data 
const Notes = [
    "Please download classes id first by clicking below download button!",
    "Please download subjects id first by clicking below download button!",
    "Now, download a example excel file to understand how you arrange your all data into excel!",
    "Upload your already made excel file and click preview button to see everything is okay!",
    "If all the things is okay, finally you can save all your student data!"
]

//Default Student Data
const DefaultData = [
    {
        studentId: "00000001",
        class: "4",
        section: "118",
        group: "55",
        shift: "1",
        image: "student/mFbewvKbbPBw6ENBLtzwdu.jpg",
        name: "John Doe",
        roll: "01",
        session: "2023",
        gender: "male",
        dob: "2023-05-04",
        blood: "A+",
        religion: "islam",
        number: "01521744659",
        email: "ecampus@gmail.com",
        fee_start: "June",
        admissionDate: "2023-05-05",
        birthCertificate: "1234567890",
        fatherName: "John Robin",
        fatherNidNumber: "1234567890",
        fatherPhone: "8801611994403",
        motherName: "Simran",
        motherNidNumber: "1234567890",
        motherPhone: "01611994403",
        guardianName: "John Vir",
        guardianNidNumber: "1234567890",
        guardianPhone: "01611994403",
        address: "Dhaka, Bangladesh",
        school: "Ecampus School And College"
    }
]

const Widget = () => {
    //State
    const [jsonData, setJsonData] = useState<Array<any>>([]);
    const [dialog, setDialog] = useState<boolean>(false);

    //Graphql
    const [classList] = useQuery<GetAllClassData>({ query: GET_ALL_CLASS });

    //On Dialog Close
    const onDialogHandler = () => {
        setDialog(false);
    }

    return (
        <div className="pb-10">
            <h4 className="font-semibold text-lg mb-3">Upload Student List</h4>
            <h4 className="font-semibold text-base mb-3">Note</h4>
            <ul>
                {Notes.map((item, i) => (
                    <li key={i} className="my-2 text-base"><span className="w-3 h-3 rounded-sm bg-main inline-block mr-2"></span>{item}</li>
                ))}
            </ul>
            <div className="flex gap-32 items-center mb-5 mt-8">
                <div className="font-semibold text-base basis-[15%]">Class</div>
                <div>
                    <ExportAsExcel
                        data={classList.data?.getAllClass.map((item) => ({ id: item.id, name: item.name, sectionId: item.section.map(item => `${item.name} (${item.id})`).join("; "), shiftId: item.shift.map(item => `${item.name} (${item.id})`).join("; "), group: item.group.map(item => `${item.name} (${item.id})`).join("; ") })) as Array<any>}
                        headers={["id", "name", "Section Name & Ids", "Shift Name & Ids", "Group Name & Ids"]}
                        fileName="Class List"
                    >
                        <Button color="green" className="bg-main py-2.5 px-10 rounded-xl">Download</Button>
                    </ExportAsExcel>
                </div>
            </div>
            <div className="flex gap-32 items-center mb-5">
                <div className="font-semibold text-base basis-[15%]">Example File</div>
                <div>
                    <ExportAsExcel
                        data={DefaultData}
                        headers={["studentId", "class", "section", "group", "shift", "image", "name", "roll", "session", "gender", "dob", "blood", "religion", "number", "email", "fee_start", "admissionDate", "birthCertificate", "fatherName", "fatherNidNumber", "fatherPhone", "motherName", "motherNidNumber", "motherPhone", "guardianName", "guardianNidNumber", "guardianPhone", "address", "school"]}
                        fileName="Example File"
                    >
                        <Button color="green" className="bg-main py-2.5 px-10 rounded-xl">Download</Button>
                    </ExportAsExcel>

                </div>
            </div>
            <div className="mt-10">
                <ExcelToJsonConverter
                    onRead={(data) => setJsonData(data)}
                >
                    {({
                        isDragging,
                        dragProps,
                        onFileUpload,
                        errors: fileError,
                        fileInfo
                    }) => (
                        <div>
                            <div className={`border border-dashed w-full text-center rounded-md py-3 cursor-pointer ${isDragging ? "border-main border-opacity-100" : "border-textColor border-opacity-50"}`} {...dragProps} onClick={onFileUpload}>
                                <Icon className={`inline text-5xl ${isDragging ? "text-main opacity-100" : "opacity-25"}`} icon="ic:outline-cloud-upload" />
                                <p className="mt-2 text-base"><span className="font-bold">Upload an File </span><span className="opacity-40">or drag and drop <br />PDF</span></p>
                            </div>
                            {fileInfo &&
                                <p className="mt-1 text-sm"><span className="text-main font-medium">Selected File: </span>{fileInfo.file.name}</p>
                            }
                            {fileError &&
                                <p className="text-red-600 text-base font-medium mt-1">{fileError}</p>
                            }
                        </div>
                    )}
                </ExcelToJsonConverter>
                <div className="text-right my-5">
                    <Button color="green" className="bg-main py-2.5 px-8" onClick={() => setDialog(true)}>Preview</Button>
                </div>
            </div>
            <Preview
                open={dialog}
                onClose={onDialogHandler}
                jsonData={jsonData}
            />
        </div>
    );
};

export default Widget;