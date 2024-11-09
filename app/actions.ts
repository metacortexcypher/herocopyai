'use server'

import { Configuration, OpenAIApi } from 'openai-edge'
import * as cheerio from 'cheerio'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export async function analyzeCopy(prevState, formData) {
  const url = formData.get('url')

  if (!url || typeof url !== 'string') {
    return { error: 'URL is required and must be a string' }
  }

  try {
    const webpageResponse = await fetch(url)
    if (!webpageResponse.ok) {
      return { error: 'Failed to fetch webpage content. Check the URL and try again.' }
    }

    const html = await webpageResponse.text()
    const $ = cheerio.load(html)

    // Extract hero content from common selectors
    const heroContent = $('header, .hero, #hero, .hero-section, #hero-section').first().text().trim()
    if (!heroContent) {
      return { error: 'Could not find hero section content' }
    }

    // Formulate prompt for OpenAI
    const prompt = `
      Analyze the following hero section content and suggest improvements:

      "${heroContent}"

      Provide a response in the following JSON format:
      {
        "originalCopy": "The original hero copy",
        "suggestedCopy": "A suggested improved version of the hero copy",
        "suggestedCTA": "A suggested call-to-action button text",
        "explanation": "A brief explanation of the changes and why they might be more effective"
      }
    `

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    const result = await response.json()

    // Check for valid AI response format
    if (
      !result.choices ||
      !result.choices[0] ||
      !result.choices[0].message ||
      !result.choices[0].message.content
    ) {
      console.error('Unexpected API response:', result)
      return { error: 'Received an unexpected response from the AI service' }
    }

    const content = result.choices[0].message.content.trim()

    // Parse JSON response content
    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return { error: 'Failed to parse the AI response' }
    }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Failed to analyze the webpage' }
  }
}
