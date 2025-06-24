
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting generate-instagram-content function')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const requestBody = await req.json()
    console.log('Request body:', requestBody)
    
    const { postId } = requestBody

    if (!postId) {
      console.error('postId is missing')
      throw new Error('postId is required')
    }

    console.log('Getting post data for ID:', postId)

    // Получаем данные поста
    const { data: post, error: postError } = await supabaseClient
      .from('instagram_auto_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError) {
      console.error('Error fetching post:', postError)
      throw new Error(`Failed to fetch post: ${postError.message}`)
    }

    if (!post) {
      console.error('Post not found')
      throw new Error('Post not found')
    }

    console.log('Post found:', post.title)

    // Проверяем API ключ OpenRouter
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY not configured')
      throw new Error('OPENROUTER_API_KEY not configured in secrets')
    }

    console.log('OpenRouter API key found, making request...')

    // Парсим стиль и язык из style_prompt
    const [style, language] = post.style_prompt.split('|')
    const targetLanguage = language || 'ru'

    // Словарь языков для промпта
    const languageNames = {
      'ru': 'русском',
      'en': 'английском',
      'es': 'испанском',
      'fr': 'французском',
      'de': 'немецком',
      'it': 'итальянском',
      'pt': 'португальском',
      'zh': 'китайском',
      'ja': 'японском',
      'ko': 'корейском'
    }

    // Формируем более краткий промпт для экономии токенов
    const prompt = `
Проанализируй изображение и создай пост для Instagram на ${languageNames[targetLanguage] || 'русском'} языке в стиле "${style}".

Создай:
1. Краткое описание (1-2 предложения) с эмодзи
2. 8-10 релевантных хештегов

Формат JSON:
{
  "caption": "описание с эмодзи",
  "hashtags": "#тег1 #тег2 #тег3..."
}
`

    // Запрос к OpenRouter AI с уменьшенным количеством токенов
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: post.content_url
                }
              }
            ]
          }
        ],
        max_tokens: 500, // Уменьшили с 1000 до 500 токенов
        temperature: 0.7
      }),
    })

    console.log('OpenRouter response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const aiResponse = await response.json()
    console.log('AI response received')
    
    const generatedContent = aiResponse.choices[0].message.content

    // Парсим JSON ответ от ИИ
    let parsedContent
    try {
      parsedContent = JSON.parse(generatedContent)
    } catch (e) {
      console.log('Failed to parse JSON, using fallback')
      // Если ИИ вернул не JSON, пытаемся извлечь контент
      parsedContent = {
        caption: generatedContent.split('\n')[0] || generatedContent,
        hashtags: '#instagram #smm #автопост'
      }
    }

    // Сохраняем предыдущую версию в историю, если она есть
    const generationHistory = Array.isArray(post.generation_history) ? post.generation_history : []
    if (post.generated_caption) {
      const newHistoryItem = {
        timestamp: new Date().toISOString(),
        caption: post.generated_caption,
        hashtags: post.generated_hashtags || '',
        version: generationHistory.length + 1
      }
      generationHistory.push(newHistoryItem)
    }

    // Оставляем только последние 5 версий
    const trimmedHistory = generationHistory.slice(-5)

    // Генерируем оптимальное время для публикации (рандомно в течение следующих 7 дней)
    const now = new Date()
    const randomDays = Math.floor(Math.random() * 7) + 1
    const randomHours = Math.floor(Math.random() * 12) + 9 // 9-21 часов
    const scheduledAt = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000)
    scheduledAt.setHours(randomHours, 0, 0, 0)

    console.log('Updating post in database...')

    // Обновляем пост с сгенерированным контентом
    const { error: updateError } = await supabaseClient
      .from('instagram_auto_posts')
      .update({
        generated_caption: parsedContent.caption,
        generated_hashtags: parsedContent.hashtags,
        generation_history: trimmedHistory,
        scheduled_at: scheduledAt.toISOString(),
        status: 'generated',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw updateError
    }

    console.log('Post updated successfully')

    return new Response(
      JSON.stringify({
        success: true,
        caption: parsedContent.caption,
        hashtags: parsedContent.hashtags,
        scheduled_at: scheduledAt.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-instagram-content function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
