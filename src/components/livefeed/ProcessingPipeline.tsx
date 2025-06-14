
import { RotateCw } from "lucide-react";

interface ProcessingPipelineProps {
  processingStep: string;
  processingSteps: string[];
}

const ProcessingPipeline = ({ processingStep, processingSteps }: ProcessingPipelineProps) => {
  return (
    <div className="mt-4 p-3 lg:p-4 bg-slate-700/30 rounded-lg">
      <div className="text-white text-sm font-semibold mb-3">Enhanced ANPR Processing Pipeline</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-3">
        {processingSteps.map((step, index) => (
          <div 
            key={step}
            className={`p-2 lg:p-3 rounded text-xs text-center transition-all duration-300 ${
              processingStep === step 
                ? "bg-blue-500/30 text-blue-400 border border-blue-500/50 scale-105 animate-pulse" 
                : "bg-slate-600/30 text-slate-400 hover:bg-slate-600/50"
            }`}
          >
            <div className="font-semibold truncate text-xs" title={step}>
              {step.split(' ')[0]}
            </div>
            {processingStep === step && (
              <div className="text-xs mt-1 text-blue-300">●</div>
            )}
          </div>
        ))}
      </div>
      
      {/* Processing indicator */}
      <div className="mt-3 flex items-center text-blue-400 text-xs lg:text-sm">
        <RotateCw className="w-3 h-3 mr-1 lg:mr-2 animate-spin" />
        <span className="hidden sm:inline">{processingStep}</span>
        <span className="sm:hidden">Processing...</span>
      </div>
    </div>
  );
};

export default ProcessingPipeline;
