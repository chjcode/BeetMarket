import { useParams } from "react-router-dom";
import ModelViewer from "@/widgets/ModelViewer/ModelViewer";

const Product3DViewerPage = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">3D 보기</h1>
      {id && <ModelViewer productId={id} />}
    </div>
  );
};

export default Product3DViewerPage;
