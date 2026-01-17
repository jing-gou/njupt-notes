import React, { useState } from 'react';
import { GitPullRequest, FileUp, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Upload() {
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const [file, setFile] = useState(null);
  const handleUpload = async (e) => {
  e.preventDefault();
  setStatus('processing');

  // 1. 将文件转为 Base64 (GitHub API 要求)
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64Content = reader.result.split(',')[1];

    // 2. 发送给后端 API
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        content: base64Content,
        course: courseName, // 从你的表单 state 获取
        category: category  // 从你的表单 state 获取
      })
    });

    if (response.ok) setStatus('success');
    else setStatus('error');
  };
};

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-16 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">PR 已发起！</h2>
        <p className="text-slate-500 mt-3">
          你的贡献已提交至 GitHub 审核队列。
          <br />管理员合并后，资料将自动同步。
        </p>
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
          <p className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">GitOps Pipeline</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> 自动创建分支成功
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> 等待管理员 Review
            </div>
          </div>
        </div>
        <button onClick={() => window.location.href = '/'} className="mt-8 text-blue-600 font-medium hover:underline text-sm">
          返回首页继续浏览
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
          />
          <FileUp className={`mx-auto mb-3 ${file ? 'text-blue-500' : 'text-slate-300'}`} size={32} />
          {file ? (
            <p className="text-blue-600 font-medium">{file.name}</p>
          ) : (
            <p className="text-slate-500 text-sm">点击或拖拽 PDF / ZIP 文件</p>
          )}
        </div>

        {/* 2. 表单字段 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">课程名称</label>
            <input required type="text" placeholder="如：信号与系统" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">资料分类</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
              <option>历年真题</option>
              <option>复习笔记</option>
              <option>实验报告</option>
            </select>
          </div>
        </div>

        {/* 3. 安全提示 */}
        <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <ShieldAlert className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800 leading-relaxed">
            <b>安全须知：</b> 资料将被上传至 GitHub 仓库分支。请确信文件中不包含个人学号、姓名等隐私信息。
          </p>
        </div>

        <button 
          disabled={status === 'processing' || !file}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {status === 'processing' ? '正在创建 Git 分支...' : '提交至 GitHub 审核'}
        </button>
      </form>
    </div>
  );
}