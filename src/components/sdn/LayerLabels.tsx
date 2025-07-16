
const LayerLabels = () => {
  return (
    <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around text-slate-400 text-xs font-cyber pointer-events-none">
      <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-cyan-500 text-cyan-300">Controller</div>
      <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-green-500 text-green-300">Core</div>
      <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-blue-500 text-blue-300">Edge</div>
      <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-purple-500 text-purple-300">Access</div>
      <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-indigo-500 text-indigo-300">Services</div>
    </div>
  );
};

export default LayerLabels;
