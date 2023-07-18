import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import { inter } from "@/Fonts/index";
import { Icon } from "@iconify/react";
import jsPDF from "jspdf"
import autoTable, { Color, CellWidthType, RowInput } from "jspdf-autotable";

//Urql
import { ResultData } from "@/Urql/Types/Examination/result.types";

//Interface
interface Props {
    open: boolean;
    onClose: () => void;
    result: ResultData
}

const Edit = ({ open, onClose, result }: Props) => {
    //Handler
    const onPrintHandler = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: "#result-summery" });
        autoTable(doc, { html: "#result-table" });
        doc.save("result.pdf");
    }

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
        >
            <DialogBody className="rounded-lg text-textColor bg-white overflow-auto max-h-[580px]">
                <div className="text-right">
                    <button className="bg-red-600 bg-opacity-25 p-1.5 rounded" onClick={onClose}>
                        <Icon className="text-xl text-red-600" icon="ic:round-close" />
                    </button>
                </div>
                <div className="overflow-x-auto mb-8">
                    <table className="table table-compact w-[80%]" id="result-summery">
                        <tbody>
                            <tr>
                                <td className="border border-solid border-textColor border-opacity-40"><span className="font-bold">Student Name: </span>{result.studentId.name}</td>
                                <td className="border border-solid border-textColor border-opacity-40"><span className="font-bold">Student ID: </span>{result.studentId.studentId}</td>
                                <td className="border border-solid border-textColor border-opacity-40"><span className="font-bold">Student Roll: </span>{result.studentId.roll}</td>
                                <td className="border border-solid border-textColor border-opacity-40"><span className="font-bold">Grade: </span>{result.gradeId.grades.sort((a, b) => Number(b.grade_point) - Number(a.grade_point)).find(grade => Number(grade.grade_point) <= (result.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / result.marks.length))?.name}</td>
                                <td className="border border-solid border-textColor border-opacity-40"><span className="font-bold">Grade Point: </span>{result.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / result.marks.length}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full" id="result-table">
                        <thead>
                            <tr>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-l-transparent border-textColor border-opacity-40 text-center">SL</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">Subject</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">Full Mark</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">CQ</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">MCQ</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">PRA</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">CA</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">Total Marks</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-textColor border-opacity-40 text-center">GP</th>
                                <th className="bg-primary capitalize text-main font-medium border border-solid border-t-transparent border-r-transparent border-textColor border-opacity-40 text-center">LG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.marks.map((item, i) => (
                                <tr key={i}>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{i < 10 ? `0${i + 1}` : i + 1}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.subjectId.name}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.fullMarks}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.cq}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.mcq}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.practical}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.ca}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.totalMarks}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.grade_point}</td>
                                    <td className="border border-solid border-textColor border-opacity-40 text-center">{item.grade}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border border-solid border-textColor border-opacity-40 text-center font-bold" colSpan={2} align="center">Grand Total</td>
                                <td className="border border-solid border-textColor border-opacity-40"></td>
                                <td className="border border-solid border-textColor border-opacity-40"></td>
                                <td className="border border-solid border-textColor border-opacity-40"></td>
                                <td className="border border-solid border-textColor border-opacity-40"></td>
                                <td className="border border-solid border-textColor border-opacity-40"></td>
                                <td className="border border-solid border-textColor border-opacity-40 font-bold text-center">{result.marks.reduce((total, mark) => total + Number(mark.totalMarks), 0)}</td>
                                <td className="border border-solid border-textColor border-opacity-40 font-bold text-center">{result.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / result.marks.length}</td>
                                <td className="border border-solid border-textColor border-opacity-40 font-bold text-center">{result.gradeId.grades.sort((a, b) => Number(b.grade_point) - Number(a.grade_point)).find(grade => Number(grade.grade_point) <= (result.marks.reduce((total, mark) => total + Number(mark.grade_point), 0) / result.marks.length))?.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-center mt-10">
                    <Button color="green" className="bg-main py-2.5 px-8" onClick={onPrintHandler}>
                        Print
                    </Button>
                </div>
            </DialogBody>
        </Dialog>
    );
};

export default Edit;