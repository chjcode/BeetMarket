import { useParams, useLocation } from "react-router-dom";
import ModelViewer from "@/widgets/ModelViewer/ModelViewer";
import { TopBarDetail } from "@/widgets/TopBar/TopBarDetail";

const Product3DViewerPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const modelPath = location.state?.model3D;

  return (
    <div className="h-[88dvh] flex flex-col overflow-hidden bg-white">
      {/* <div className="absolute top-0 left-0 w-full z-10"></div> */}
      <div className="flex-1 overflow-hidden">
        <TopBarDetail title={location.state?.title} />
        {id && <ModelViewer productId={id} modelPath={modelPath} />}
      </div>
    </div>
  );
};

export default Product3DViewerPage;
