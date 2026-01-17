import React, { useState, useEffect } from 'react';
import { GitPullRequest, FileUp, CheckCircle2, ShieldAlert, Search, Loader2 } from 'lucide-react';

export default function Upload() {
  const [status, setStatus] = useState('idle'); 
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('历年真题');
  const [allCourses, setAllCourses] = useState([]); 
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 1. 初始化读取缓存
  useEffect(() => {
    const cached = localStorage.getItem('course_list');
    if (cached) {
      try {
        setAllCourses(JSON.parse(cached));
      } catch (e) {
        console.error("解析缓存失败", e);
      }
    }
  }, []);

  // 2. 处理课程名称输入（搜索建议逻辑放在这里）
  const handleCourseInputChange = (value) => {
    setCourseName(value);
    if (value.trim().length > 0) {
      const filtered = allCourses
        .filter(c => c.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 3. 提交处理
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !courseName) return;

    const MAX_SIZE_MB = 4.5; 
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      alert(`文件太大了！目前免费版最大支持 ${MAX_SIZE_MB}MB，当前文件 ${(file.size / (1024 * 1024)).toFixed(2)}MB。\n\n如有大文件需求可发送至：sugar.pub@outlook.com`);
      return;
    }

    setStatus('processing');

    const reader = new FileReader();
    reader.readAsDataURL(file); // 修正拼写
    reader.onload = async () => {
      const base64Content = reader.result.split(',')[1];
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            content: base64Content,
            course: courseName,
            category: category 
          })
        });

        if (response.ok) {
          setStatus('success');
          setFile(null);
        } else {
          const errData = await response.json();
          setStatus('error');
          alert(`上传失败: ${errData.error}`);
        }
      } catch (err) {
        setStatus('error');
        alert("网络请求失败，请稍后重试");
      }
    };
  };

  // 成功后的界面展示
  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-16 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">PR 已发起！</h2>
        <p className="text-slate-500 mt-3">你的贡献已提交至 GitHub 审核队列。<br />管理员合并后，资料将自动同步。</p>
        <button onClick={() => setStatus('idle')} className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium">
          继续贡献资料
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-900 text-white rounded-lg">
          <GitPullRequest size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">贡献学术资料</h2>
          <p className="text-sm text-slate-500">基于 GitHub 的半自动审核系统</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
        
        {/* 1. 文件拖拽区 */}
        <div className={`relative border-2 border-dashed rounded-xl p-10 transition-all text-center
          ${file ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-400'}`}>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.zip,.rar,.7z,.ppt,.pptx,.jpg,.png,.doc,.docx"
          />
          <FileUp className={`mx-auto mb-3 ${file ? 'text-blue-500' : 'text-slate-300'}`} size={32} />
          {file ? (
            <div className="space-y-1">
              <p className="text-blue-600 font-medium truncate max-w-xs mx-auto">{file.name}</p>
              <p className="text-xs text-blue-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-slate-500 text-sm">点击或拖拽 PDF/PNG/ZIP/DOC 文件</p>
              <p className="text-[10px] text-slate-400">最大支持 4.5MB</p>
            </div>
          )}
        </div>

        {/* 2. 表单字段区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-500 uppercase">课程名称</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                value={courseName}
                onChange={(e) => handleCourseInputChange(e.target.value)}
                onFocus={() => courseName && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="如：信号与系统" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.map((s, i) => (
                    <div 
                      key={i}
                      onClick={() => { setCourseName(s); setShowSuggestions(false); }}
                      className="px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer flex items-center justify-between group"
                    >
                      <span className="truncate">{s}</span>
                      <Search size={14} className="text-slate-300 group-hover:text-blue-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">资料分类</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="历年真题">历年真题</option>
              <option value="复习笔记">复习笔记</option>
              <option value="实验报告">实验报告</option>
              <option value="课后答案">课后答案</option>
            </select>
          </div>
        </div>

        {/* 3. 安全提示 */}
        <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <ShieldAlert className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800 leading-relaxed">
            <b>安全须知：</b> 资料将被上传至 GitHub。请确信文件中不包含个人学号、姓名等隐私信息。
          </p>
        </div>

        <button 
          type="submit"
          disabled={status === 'processing' || !file || !courseName}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              正在同步至 GitHub...
            </>
          ) : (
            '提交至 GitHub 审核'
          )}
        </button>
      </form>
    </div>
  );
}