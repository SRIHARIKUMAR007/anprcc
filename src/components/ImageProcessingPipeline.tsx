
import LiveCameraANPR from "./LiveCameraANPR";

const ImageProcessingPipeline = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Live Camera ANPR System */}
      <LiveCameraANPR />
    </div>
  );
};

export default ImageProcessingPipeline;
