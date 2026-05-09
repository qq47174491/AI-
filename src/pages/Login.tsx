export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">智采云</h1>
        <p className="text-center text-slate-600 mb-8">AI采购寻源管理系统</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          进入系统
        </button>
      </div>
    </div>
  )
}
