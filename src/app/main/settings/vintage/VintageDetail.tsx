import { useParams } from "react-router";
import VintageContent from "./VintageContent";
import VintageDetailHeader from "./VintageDetailHeader";

function VintageDetail() {
  const routeParams = useParams();
  const { vintageId } = routeParams;

  return (
    <div className="flex flex-col w-full">
      <div>
        <VintageDetailHeader vintageId={vintageId} />
      </div>
      <div className="m-20">
        <VintageContent vintageId={vintageId} />
      </div>
    </div>
  );
}

export default VintageDetail;
