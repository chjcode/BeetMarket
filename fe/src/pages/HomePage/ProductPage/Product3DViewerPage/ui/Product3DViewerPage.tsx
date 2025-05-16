import { useParams, useLocation } from "react-router-dom";
import ModelViewer from "@/widgets/ModelViewer/ModelViewer";

const Product3DViewerPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const modelPath = location.state?.model3D;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <h1 className="text-xl font-bold mb-4">3D 보기</h1>
      <div className="flex-1 overflow-hidden">
        {id && <ModelViewer productId={id} modelPath={modelPath} />}
      </div>
    </div>
  );
};

export default Product3DViewerPage;
