import moment from "moment";
import React, { useEffect, useRef } from "react";
import { currencyFormatter } from "src/utils/coreFunction";
import html2pdf from "html2pdf.js";

interface WatchData {
  material?: string;
  materialGroup?: string;
  strapBracelet?: string;
  size?: string;
  description?: string;
  qty?: number;
  bracelet?: number;
  unitPrice?: number;
  movement?: number;
  case?: number;
  totalValue?: number;
}

interface WatchComparisonTableProps {
  watches: WatchData[];
}

const WatchHkToNYPdf = ({ watches, setDetailRows }) => {
  const invoicePDFRef = useRef();

  const formatDate = (dateString: any) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const braceletFull = {
    "Strap(Rubber/Leather/Fabric)": 0,
    "Bracelet for PO": 15,
    "Bracelet for NEW": 30,
  };

  const deStructureArray = watches?.map((item) => {
    return {
      ...item,
      strapBraceletValue: braceletFull[item?.strapBracelet],
    };
  });

  const handleDownload = async () => {
    const element = invoicePDFRef.current;
    const opt = {
      margin: 0.3,
      filename: "AllWatch-invoiceHKToUS.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    await html2pdf().set(opt).from(element).save();

    setDetailRows([]); // Clear detailRows after download
  };

  useEffect(() => {
    if (deStructureArray?.length > 0) {
      setTimeout(() => {
        handleDownload();
      }, 300);
    }
  }, [deStructureArray?.length]);

  return (
    <div ref={invoicePDFRef}>
      {deStructureArray?.map((watch, index) => (
        <div
          className={`bg-white border-2 mt-[4px] border-black px-[4px] pb-[4px] font-mono text-[11.5px] ${deStructureArray?.length - 1 === index ? "" : "break-after-page"}`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold pb-1">Watch Worksheet</h1>
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">1.</span>
              <span className="pb-1">Description of goods:</span>
              <div className="border-b border-black px-2 py-1 min-w-[200px] pb-[5px]">
                WRIST WATCH
              </div>
              <span className="pb-1">Part number:</span>
              <div className="border-b border-black px-2 py-[4px] min-w-[100px] mt-[14px]"></div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">2.</span>
              <span className="pb-1">Tariff number/HS code:</span>
              <div className="border-b border-black px-2 py-[4px] min-w-[200px] mt-[14px]"></div>
            </div>

            {/* Row 3 */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center space-x-4 pb-1">
                <span className="font-bold">3.</span>
                <span className="pb-1">
                  Harmonized Tariff Schedule of the United States is online:
                </span>
                <span className="pb-1">
                  http://www.usitc.gov/tata/hts/bychapter/index.htm
                </span>
              </div>
              <div className="flex items-center space-x-4 ml-4 pb-1">
                <span className="pb-1">Which best describes the article?</span>
              </div>
              <div className="ml-8 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] pb-[5px]">
                    ✓
                  </div>
                  <div className="">Wrist watch</div>
                </div>
              </div>
              <div className="ml-8 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] py-[4px] w-[27px] mt-[14px] mt-[14px]">
                    {" "}
                  </div>
                  <div className="">
                    Pocket or other watches not worn on the wrist
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center space-x-4 pb-1">
                <span className="font-bold">4.</span>
                <span className="pb-1">
                  If the case has precious metal*, what type is it?
                </span>
              </div>

              <div className="ml-8 space-y-1 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] pb-[5px]">
                    ✓
                  </div>
                  <span className="pb-1">
                    The case is wholly made of, or clad with, precious metal
                  </span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] py-[4px] w-[27px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">
                    The case is plated or filled with precious metal in it gold
                    or silver plated?
                  </span>
                  <span className="ml-4 pb-1">___Yes/___No</span>
                </div>
              </div>
              <div className="ml-4 pb-1">
                <span className="pb-1">
                  * The precious metals are gold, silver, platinum, iridium,
                  osmium, palladium, rhodium and ruthenium.
                </span>
              </div>
            </div>

            {/* Row 5 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">5.</span>
              <span className="pb-1">
                Is the back plate wholly made of, or clad with, precious metal?
              </span>
              <span className="ml-4 pb-1">
                {" "}
                <span className="mr-[10px] border-b border-black px-[8px] pb-[4px]">
                  ✓
                </span>
                Yes/___No
              </span>
            </div>

            {/* Row 6 */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center space-x-4 pb-1">
                <span className="font-bold">6.</span>
                <span className="pb-1">What is the display?</span>
              </div>
              <div className="ml-8 space-y-1 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] pb-[5px]">
                    ✓
                  </div>
                  <span className="pb-1">Mechanical (without) only</span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Opto-electronic (digital) only</span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Both analog and digital</span>
                </div>
              </div>
            </div>

            {/* Row 7 */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center space-x-4 pb-1">
                <span className="font-bold">7.</span>
                <span className="pb-1">What is the power source?</span>
              </div>
              <div className="ml-8 space-y-1 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Electric (battery, solar)</span>
                </div>
                <div className="flex items-end space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] pb-[5px]">
                    ✓
                  </div>
                  <span className="pb-1">Automatic (self) winding</span>
                </div>
                <div className="flex items-center space-x-2 pb-1 pt-[2px]">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Manual winding</span>
                </div>
              </div>
            </div>

            {/* Row 8 */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center space-x-4 pb-1">
                <span className="font-bold">8.</span>
                <span className="pb-1">
                  What is the strap, band or bracelet (or chain for pocket
                  watches) made of?
                </span>
              </div>
              <div className="ml-8 space-y-1 pb-1">
                <div className="flex items-center space-x-2 pb-1">
                  <div
                    className={`mr-[10px] border-b border-black px-[8px] pb-[5px] ${watch?.strapBracelet !== "Bracelet for PO" && watch?.strapBracelet !== "Bracelet for NEW" && "w-[26px] py-[4px] mt-[14px]"}`}
                  >
                    {(watch?.strapBracelet == "Bracelet for PO" ||
                      watch?.strapBracelet == "Bracelet for NEW") &&
                      "✓"}
                  </div>
                  <span className="pb-1">
                    Precious metal or base metal clad with precious metal
                  </span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">
                    Base metal (stainless steel, brass, etc.), whether or not
                    plated with precious metal
                  </span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Textile/Cloth</span>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">
                    Leather – what type (bovine, equine, etc.)?
                  </span>
                  <div className="border-b border-black px-2 py-1 min-w-[200px] ml-2 mt-[17px]"></div>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div className="mr-[10px] border-b border-black px-[8px] w-[26px] py-[4px] mt-[14px]">
                    {" "}
                  </div>
                  <span className="pb-1">Other:</span>
                  <div className="border-b border-black px-2 py-1 min-w-[200px] ml-2 mt-[17px]"></div>
                </div>
                <div className="flex items-center space-x-2 pb-1">
                  <div
                    className={`mr-[10px] border-b border-black px-[8px] pb-[5px] ${watch?.strapBracelet !== "Strap(Rubber/Leather/Fabric)" && "w-[26px] py-[4px] mt-[14px]"}`}
                  >
                    {watch?.strapBracelet == "Strap(Rubber/Leather/Fabric)" &&
                      "✓"}
                  </div>
                  <span className="pb-1">No strap, band or bracelet</span>
                </div>
              </div>
            </div>

            {/* Row 9 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">9.</span>
              <span className="pb-1">How many jewels are in the movement?</span>
              <div className="border-b border-black px-2 py-1 min-w-[100px] pl-[45px] pb-[5px]">
                27
              </div>
            </div>

            {/* Row 10 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">10.</span>
              <span className="pb-1">
                What is the country of origin of the movement that controls
                hours/minutes?
              </span>
              <div className="border-b border-black px-2 py-1 min-w-[150px] pl-[45px] pb-[5px]">
                SWITZERLAND
              </div>
            </div>

            {/* Row 11 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">11.</span>
              <span className="pb-1">
                If the movement value is not over $15 each, does it measure over
                15.2 mm?
              </span>
              <span className="ml-4 pb-1">___Yes/___No</span>
            </div>

            {/* Row 12 */}
            <div className="flex items-center space-x-4 pb-1">
              <span className="font-bold">12.</span>
              <span className="pb-1">
                List functions in order of importance (time keeping, GPS, Wi-Fi,
                heart monitor, pedometer, etc.)?
              </span>
            </div>
            <div className="border-b border-black px-2 py-1 max-w-[400px] pb-[5px]">
              TIMEKEEPING
            </div>

            <div className="pl-[25px] py-[4px]">
              <div className="pb-1">Value breakdown of components:</div>
              {/* Row 13 */}
              <div className="pl-[25px] pb-1 flex items-center space-x-4">
                <span className="pb-1">Movement:</span>
                <div className="px-2 py-1 min-w-[200px]">
                  {" "}
                  {currencyFormatter.format(watch?.amountConverted * 0.8)}
                </div>
              </div>
              {/* Row 14 */}
              <div className="pl-[25px] pb-1 flex items-center space-x-4">
                <span className="pb-1">Case:</span>
                <div className="px-2 py-1 min-w-[200px]">
                  {currencyFormatter.format(
                    watch?.amountConverted -
                      watch?.amountConverted * 0.8 -
                      watch?.strapBraceletValue
                  )}
                </div>
              </div>
              {/* Row 15 */}
              <div className="pl-[25px] pb-1 flex items-center space-x-4">
                <span className="pb-1">Strap:</span>
                <div className="px-2 py-1 min-w-[200px]">
                  {currencyFormatter.format(watch?.strapBraceletValue)}
                </div>
              </div>
              {/* Row 16 */}
              <div className="pl-[25px] pb-1 flex items-center space-x-4">
                <span className="pb-1">Battery:</span>
                <div className="px-2 py-1 min-w-[200px]">$0.00</div>
              </div>
              {/* Row 17 */}
              <div className="pl-[25px] pb-1 flex items-center space-x-4">
                <span className="pb-1">Total watch value:</span>
                <div className="px-2 py-1 min-w-[200px]">
                  {currencyFormatter.format(watch?.amountConverted)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-8 pb-1">
              <div className="pb-1">Completed by:</div>
              <div className="flex gap-[60px] w-full">
                <div className="flex space-x-4 pb-1 w-[30%]">
                  <span className="pb-1">Name:</span>
                  <div className="border-b border-black flex-1 px-2 py-1"></div>
                </div>
                <div className="flex space-x-4 pb-1 w-[30%]">
                  <span className="pb-1">Signature:</span>
                  <div className="border-b border-black flex-1 px-2 py-1"></div>
                </div>
                <div className="flex space-x-4 pb-1 w-[30%]">
                  <span className="pb-1">Date:</span>
                  <div className="border-b border-black px-2 py-1 min-w-[100px] pb-[5px]">
                    {formatDate(new Date())}
                  </div>
                </div>
              </div>

              <div className="flex gap-[50px] w-full">
                <div className="flex space-x-4 pb-1 w-[30%]">
                  <span className="pb-1">Title:</span>
                  <div className="border-b border-black flex-1 px-2 py-1"></div>
                </div>
                <div className="flex space-x-4 pb-1 w-[30%]">
                  <span className="pb-1">Company:</span>
                  <div className="border-b border-black px-2 py-1 min-w-[150px] pb-[5px]">
                    MLA Trading Co., Ltd.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WatchHkToNYPdf;
