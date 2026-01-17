import React, { useState, useEffect } from 'react';
import { Folder, FileText, Download, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFolder, setOpenFolder] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (res.ok) {
        setResources(data);
        localStorage.setItem('course_list', JSON.stringify(Object.keys(data)));
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-500 font-medium">正在检索深层文件树...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">资料仓库</h2>
        <button 
          onClick={fetchResources}
          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
          title="刷新列表"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {Object.keys(resources).length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">仓库空空如也，快去上传第一份资料吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(resources).map(([course, files]) => (
            <div key={course} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => setOpenFolder(openFolder === course ? null : course)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Folder size={22} className={openFolder === course ? "text-blue-500 fill-blue-50" : "text-slate-400"} />
                  <span className="font-semibold text-slate-700">{course}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{files.length}</span>
                </div>
                <ChevronRight className={`text-slate-400 transition-transform ${openFolder === course ? 'rotate-90' : ''}`} size={18} />
              </button>
              
              {openFolder === course && (
                <div className="bg-slate-50/50 border-t border-slate-100 divide-y divide-slate-100">
                  {files.map((file) => (
                    <div key={file.sha} className="flex items-center justify-between p-4 pl-12 hover:bg-white transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={18} className="text-slate-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                          <p className="text-[11px] text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <a 
                        href={file.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}