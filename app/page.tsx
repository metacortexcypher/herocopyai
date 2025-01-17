'use client'

import { useState } from 'react'
import { analyzeCopy } from './actions'

export default function HeroCopyImprover() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setResult(null)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await analyzeCopy(null, formData)
      setResult(response)
    } catch (error) {
      console.error('Error in analyzeCopy:', error)
      setResult({ error: 'An error occurred while processing your request.' })
    } finally {
      setIsLoading(false)
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
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result?.error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {result.error}
        </div>
      )}

      {result && !result.error && (
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
