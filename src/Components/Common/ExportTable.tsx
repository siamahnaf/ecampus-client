import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { ExportAsExcel, CopyToClipboard, ExportAsPdf, PrintDocument } from "react-export-table";

//Interface
interface Props {
    data: Array<any>;
    headers: string[];
    fileName: string;
}

const ExportTable = ({ data, headers, fileName }: Props) => {
    //State
    const [copied, setCopied] = useState<boolean>(false);

    //Lifecycle Hook
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [copied]);
    return (
        <div className="bg-textColor bg-opacity-5 w-max ml-auto px-3 rounded-3xl flex">
            <div className="tooltip" data-tip={copied ? "Copied" : "Copy Document"}>
                <CopyToClipboard
                    data={data}
                    headers={headers}
                    onCopied={() => setCopied(true)}
                >
                    <button className="px-4 py-[9px] border-r border-neutral-200 border-solid active:bg-neutral-300">
                        <Icon icon="material-symbols:content-copy" className="text-xl" />
                    </button>
                </CopyToClipboard>

            </div>
            <div className="tooltip" data-tip="Export as Excel">
                <ExportAsExcel
                    data={data}
                    headers={headers}
                    name={fileName}
                    fileName={fileName}
                >
                    <button className="px-4 py-[9px] border-r border-neutral-200 border-solid active:bg-neutral-300">
                        <Icon icon="mdi:file-excel" className="text-xl" />
                    </button>
                </ExportAsExcel>
            </div>
            <div className="tooltip" data-tip="Export as PDF">
                <ExportAsPdf
                    data={data}
                    headers={headers}
                    title={fileName}
                    fileName={fileName}
                    headerStyles={{ fillColor: "#00AB55" }}
                >
                    <button className="px-4 py-[9px] border-r border-neutral-200 border-solid active:bg-neutral-300">
                        <Icon icon="material-symbols:picture-as-pdf" className="text-xl" />
                    </button>
                </ExportAsPdf>
            </div>
            <div className="tooltip tooltip-left" data-tip="Print">
                <PrintDocument
                    data={data}
                    headers={headers}
                    title={fileName}
                    headerStyles={{ fillColor: "#00AB55" }}
                >
                    <button className="px-4 py-[9px] active:bg-neutral-300">
                        <Icon icon="material-symbols:print" className="text-xl" />
                    </button>
                </PrintDocument>
            </div>
        </div>
    );
};

export default ExportTable;