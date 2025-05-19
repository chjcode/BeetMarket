import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MTLLoader, OBJLoader } from "three-stdlib";
import * as THREE from "three";
import { RiResetLeftLine } from "react-icons/ri";

interface ModelViewerProps {
  productId: string;
  modelPath: string;
}

interface ModelProps {
  objBlob: Blob;
  mtlBlob: Blob;
  scale: number;
  modelPath: string;
}

const Model = ({ objBlob, mtlBlob, scale, modelPath }: ModelProps) => {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const objURL = URL.createObjectURL(objBlob);
      const mtlURL = URL.createObjectURL(mtlBlob);

      const materials = await new MTLLoader()
        .setResourcePath(modelPath)
        .loadAsync(mtlURL);
      materials.preload();

      const texture = new THREE.TextureLoader().load(
        `${modelPath}texture_1001.png`,
        () => console.log("텍스처 로드 완료"),
        undefined,
        (err) => console.error("텍스처 로드 실패", err)
      );

      for (const name in materials.materials) {
        const mat = materials.materials[name] as THREE.MeshPhongMaterial;
        if (!mat.map) {
          mat.map = texture;
          mat.needsUpdate = true;
        }
      }

      const object = await new OBJLoader()
        .setMaterials(materials)
        .loadAsync(objURL);

      object.scale.set(scale, scale, scale);
      setObj(object);

      return () => {
        URL.revokeObjectURL(objURL);
        URL.revokeObjectURL(mtlURL);
      };
    };

    loadModel();
  }, [objBlob, mtlBlob, scale, modelPath]);

  return obj ? <primitive object={obj} /> : null;
};

const ModelViewer = ({ productId, modelPath }: ModelViewerProps) => {
  const [showHint, setShowHint] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [objBlob, setObjBlob] = useState<Blob | null>(null);
  const [mtlBlob, setMtlBlob] = useState<Blob | null>(null);

  const minZoom = 1;
  const maxZoom = 5;
  const [cameraDistance, setCameraDistance] = useState(2);

  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const objRes = await fetch(`${modelPath}texturedMesh.obj`);
        const mtlRes = await fetch(`${modelPath}texturedMesh.mtl`);
        if (!objRes.ok || !mtlRes.ok) throw new Error("모델 파일을 불러올 수 없습니다.");
        setObjBlob(await objRes.blob());
        setMtlBlob(await mtlRes.blob());
      } catch (err) {
        console.error(err);
      }
    };
    loadModel();
  }, [productId, modelPath]);

  const handleReset = () => setResetTrigger((prev) => prev + 1);

  const handleClickCanvas = () => {
    setShowHint(false);
    setTimeout(() => setShowHint(true), 3000);
  };

  const handlePointerMove = () => {
    setIsInteracting(true);
    setShowHint(false);

    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);

    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
      setShowHint(true);
    }, 2000);
  };

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("pointermove", handlePointerMove);
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  }, [resetTrigger]);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-md overflow-hidden">
      <button
        onClick={handleReset}
        className="absolute top-4 right-[17px] w-[48px] h-[48px] z-10 flex items-center justify-center"
      >
        <RiResetLeftLine size={32} className="text-gray-700" />
      </button>

      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step="0.01"
        value={maxZoom - cameraDistance + minZoom}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          const reversed = maxZoom - value + minZoom;
          setCameraDistance(reversed);
          if (cameraRef.current) {
            const dir = cameraRef.current.position.clone().normalize();
            cameraRef.current.position.copy(dir.multiplyScalar(reversed));
          }
        }}
        className="absolute right-[17px] top-1/2 -translate-y-1/2 h-48 w-5 z-10 accent-blue-600"
        style={{
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
        }}
      />

      <Canvas
        className="touch-none"
        onClick={handleClickCanvas}
        camera={{ position: [0, 0, cameraDistance], fov: 45 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          {objBlob && mtlBlob && (
            <Model objBlob={objBlob} mtlBlob={mtlBlob} scale={1} modelPath={modelPath} />
          )}
        </Suspense>
        <DreiOrbitControls
          ref={orbitControlsRef}
          enableZoom
          minDistance={minZoom}
          maxDistance={maxZoom}
          onChange={() => {
            if (cameraRef.current) {
              const dist = cameraRef.current.position.length();
              setCameraDistance(parseFloat(dist.toFixed(2)));
            }
          }}
        />
      </Canvas>

      {!isInteracting && showHint && (
        <div className="absolute bottom-32 w-full text-center text-gray-400 text-xl pointer-events-none">
          슬라이더를 이용해 크기를 조절하세요
          <br />
          물체를 클릭한 후 돌려보세요
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
