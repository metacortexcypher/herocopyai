'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hook'
import { analyzeCopy } from './actions'

export default function HeroCopyImprover() {
  const [result, setResult] = useState<any>(null)
  const { execute, status } = useAction(analyzeCopy)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const response = await execute(formData)
    if (response.data) {
      try {
        const jsonResult = JSON.parse(response.data)
        setResult(jsonResult)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        setResult({ error: 'Failed to parse result' })
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hero Copy Improver</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="url"
          name="url"
          required
          placeholder="Enter website URL"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={status === 'executing'}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {status === 'executing' ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Original Copy:</h3>
            <p className="mb-2">{result.originalCopy}</p>
            <h3 className="font-semibold">Suggested Copy:</h3>
            <p className="mb-2">{result.suggestedCopy}</p>
            <h3 className="font-semibold">Suggested CTA:</h3>
            <p className="mb-2">{result.suggestedCTA}</p>
            <h3 className="font-semibold">Explanation:</h3>
            <p>{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}