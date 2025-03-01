import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

// Model Component with Rotation
function Model({ path, scale }) {
    const { scene } = useGLTF(path, (loader) => {
        loader.onError = (error) => {
            console.error("Error loading model:", error);
        };
    });

    const modelRef = useRef();

    // Rotate the model smoothly
    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += 0.01;
        }
    });

    return <primitive ref={modelRef} object={scene} scale={scale} position={[0, -1, 0]} />;
}

function ThreeD() {
    const models = ["/models/comA.glb"];
    const [currentModel, setCurrentModel] = useState(models[0]); // Default model

    return (
        <Canvas dpr={[1, 3]} shadows camera={{ fov: 45 }} style={{ position: "absolute", width: "100%", height: "100%" }}>
            <PresentationControls speed={1.5} global zoom={0.3} polar={[-0.1, Math.PI / 4]}>
                <Stage environment={null}>
                    <Model path={currentModel} scale={0.5} /> 
                </Stage>
            </PresentationControls>
        </Canvas>
    );
}

export default ThreeD;
