import { useCallback, useEffect, useState } from 'react'

export default function useAsync(fn) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fn())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [fn])

  useEffect(() => { load() }, [load])

  return { data, error, loading, reload: load }
}