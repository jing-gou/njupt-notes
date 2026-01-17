import React, { useState } from 'react';
// 直接引入自动生成的 JSON
import resources from '../data/resources.json'; 
import { Folder, FileText, Download, ChevronRight } from 'lucide-react';

export default function Home() {
  const [openFolder, setOpenFolder] = useState(null);

  // 如果没有数据时的展示
  if (!resources || Object.keys(resources).length === 0) {
    return <div className="text-center py-20 text-gray-400">资料库暂空，期待你的贡献。</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">课程资料分类</h2>
      {Object.entries(resources).map(([course, files]) => (
        <div key={course} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
          <button 
            onClick={() => setOpenFolder(openFolder === course ? null : course)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Folder size={20} className={openFolder === course ? "text-blue-500" : "text-gray-400"} />
              <span className="font-medium">{course}</span>
              <span className="text-xs text-gray-400">({files.length})</span>
            </div>
            <ChevronRight className={`transition-transform ${openFolder === course ? 'rotate-90' : ''}`} size={16} />
          </button>
          
          {openFolder === course && (
            <div className="bg-slate-50 divide-y divide-gray-100">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 pl-12">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-[10px] text-gray-400">{file.size} · {file.date}</p>
                    </div>
                  </div>
                  <a 
                    href={file.path} 
                    download 
                    className="p-2 text-blue-600 hover:bg-white rounded-full transition-all"
                  >
                    <Download size={18} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}