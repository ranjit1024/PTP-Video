
import "./index.css";

export function App() {
  return (
    <div>
    <div className="flex justify-between w-full gap-10">
      <div className="border-2 border-emerald-200 w-full rounded">
        <video  className="h-64 w-150 object-cover"></video>
      </div>
      <div className="border-2 border-red-200 w-full rounded">
        <video  className="h-64 w-full object-cover"></video>
      </div>
    </div>
      <button className="mt-5 bg-slate-200 text-black px-8 py-2 rounded font-medium">Start Camara</button>
    </div>
  );
}

export default App;
