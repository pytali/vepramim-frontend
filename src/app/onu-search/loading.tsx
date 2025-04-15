export default function Loading() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
        <div className="mt-4 text-gray-900 dark:text-white text-center">Carregando...</div>
      </div>
    </div>
  )
}
