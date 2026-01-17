import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
    <HashRouter>
      {/* 导航栏 - 简洁学术风 */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-800">
            NJUPT <span className="text-blue-600">Notes</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="nav-link">找资料</Link>
            <Link to="/upload" className="btn-primary">贡献资料</Link>
          </div>
        </div>
      </nav>

      {/* 主体内容区 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>

      {/* 页脚 */}
      <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>© 2026 NJUPT Notes · 仅供学术交流使用</p>
      </footer>
    </HashRouter>
  );
}

export default App;