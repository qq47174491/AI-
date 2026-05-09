import { useSearchParams } from 'react-router-dom'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">搜索结果</h1>
        <p className="text-slate-600">搜索关键词: {query}</p>
      </div>
    </div>
  )
}
