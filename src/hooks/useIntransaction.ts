import { useState, useCallback } from 'react'
//hooks for async functions
//loading is true when function is executing, false when done

const useInTransaction = <T extends (...params: any) => Promise<any>>(
  transactionAction: T,
) => {
  const [loading, setStatus] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleExecAction = useCallback(
    async (..._params: Parameters<T>) => {
      try {
        setStatus(true)
        await transactionAction(...(_params as any))
        setStatus(false)
      } catch (err: any) {
        setStatus(false)
        if (err?.code === 4001) {
          setError('You cancel the transaction.')
        } else {
          setError(err?.message || 'Unknown error')
        }
        console.log('Handle action err', err)
      }
    },
    [transactionAction],
  )

  return {
    loading,
    error,
    handleExecAction,
  }
}

export default useInTransaction
