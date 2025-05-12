import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MTLLoader, OBJLoader } from "three-stdlib";
import * as THREE from "three";

interface ModelViewerProps {
  productId: string;
}

interface ModelProps {
  objBlob: Blob;
  mtlBlob: Blob;
  scale: number;
}

const Model = ({ objBlob, mtlBlob, scale }: ModelProps) => {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const objURL = URL.createObjectURL(objBlob);
      const mtlURL = URL.createObjectURL(mtlBlob);

      const materials = await new MTLLoader()
        .setResourcePath('/models/')
        .loadAsync(mtlURL);
      materials.preload();

      const texture = new THREE.TextureLoader().load(`/models/1.png`);
      for (const name in materials.materials) {
        const mat = materials.materials[name] as THREE.MeshPhongMaterial;
        if (!mat.map) {
          mat.map = texture;
          mat.needsUpdate = true;
        }
      }

      const object = await new OBJLoader().setMaterials(materials).loadAsync(objURL);
      object.scale.set(scale, scale, scale);
      setObj(object);

      return () => {
        URL.revokeObjectURL(objURL);
        URL.revokeObjectURL(mtlURL);
      };
    };

    loadModel();
  }, [objBlob, mtlBlob, scale]);

  return obj ? <primitive object={obj} /> : null;
};

const ModelViewer = ({ productId }: ModelViewerProps) => {
  const [scale, setScale] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  const [objBlob, setObjBlob] = useState<Blob | null>(null);
  const [mtlBlob, setMtlBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const [objRes, mtlRes] = await Promise.all([
          fetch(`/models/${productId}.obj`),
          fetch(`/models/${productId}.mtl`),
        ]);

        if (!objRes.ok || !mtlRes.ok) throw new Error("모델 파일을 불러올 수 없습니다.");

        const objBlob = await objRes.blob();
        const mtlBlob = await mtlRes.blob();

        setObjBlob(objBlob);
        setMtlBlob(mtlBlob);
      } catch (err) {
        console.error(err);
      }
    };

    loadModel();
  }, [productId]);

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  const handleClickCanvas = () => {
    setShowHint(false);
    setTimeout(() => setShowHint(true), 3000);
  };

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  }, [resetTrigger]);

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-md overflow-hidden">
      <button onClick={handleReset} className="absolute top-4 right-4 text-2xl z-10">🔄</button>

      <input
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-32 z-10 accent-blue-600 [writing-mode:bt-lr] rotate-180"
      />

      <Canvas onClick={handleClickCanvas}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          {objBlob && mtlBlob && (
            <Model objBlob={objBlob} mtlBlob={mtlBlob} scale={scale} />
          )}
        </Suspense>
        <DreiOrbitControls ref={orbitControlsRef} />
      </Canvas>

      {showHint && (
        <div className="absolute bottom-2 w-full text-center text-gray-400 text-sm pointer-events-none">
          슬라이더를 이용해 크기를 조절하세요<br />
          물체를 클릭한 후 돌려보세요
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
