
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramApiConfig {
  app_id: string;
  app_secret: string;
  access_token: string;
  instagram_account_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { postId } = await req.json()

    if (!postId) {
      throw new Error('postId is required')
    }

    console.log(`Publishing post ${postId} via Instagram Graph API`)

    // Получаем данные поста
    const { data: post, error: postError } = await supabaseClient
      .from('instagram_auto_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      throw new Error('Post not found')
    }

    // Получаем настройки API пользователя
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('user_settings')
      .select('setting_value')
      .eq('user_id', post.user_id)
      .eq('setting_key', 'instagram_graph_api')
      .single()

    if (settingsError || !settingsData) {
      throw new Error('Instagram Graph API не настроен. Перейдите в настройки для конфигурации.')
    }

    const apiConfig = settingsData.setting_value as InstagramApiConfig

    // Проверяем наличие сгенерированного контента
    if (!post.generated_caption) {
      throw new Error('Post content must be generated first')
    }

    console.log('Publishing via Instagram Graph API...')
    console.log('Image URL:', post.content_url)
    console.log('Caption length:', post.generated_caption.length)

    // Обновляем статус на "в процессе"
    await supabaseClient
      .from('instagram_auto_posts')
      .update({
        status: 'scheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    try {
      // Сначала проверим доступность Instagram Business Account
      console.log('Checking Instagram Business Account access...')
      const checkResponse = await fetch(`https://graph.facebook.com/v18.0/${apiConfig.instagram_account_id}?fields=id,username&access_token=${apiConfig.access_token}`)
      const checkData = await checkResponse.json()
      
      console.log('Instagram account check response:', checkData)
      
      if (checkData.error) {
        console.error('Instagram account access error:', checkData.error)
        
        // Даем более понятные сообщения об ошибках
        let errorMessage = checkData.error.message
        if (checkData.error.code === 190) {
          errorMessage = 'Токен доступа недействителен или истек. Обновите токен в настройках.'
        } else if (checkData.error.code === 200) {
          errorMessage = 'Недостаточно разрешений. Токену нужны права: instagram_basic, instagram_content_publish, pages_show_list'
        } else if (checkData.error.message.includes('does not exist')) {
          errorMessage = 'Instagram Business Account с указанным ID не найден. Проверьте ID в настройках или используйте поиск аккаунтов.'
        }
        
        throw new Error(`Ошибка доступа к Instagram Business Account: ${errorMessage}`)
      }

      console.log(`Instagram account verified: @${checkData.username}`)

      // Шаг 1: Создаем медиа контейнер
      console.log('Creating media container...')
      const mediaResponse = await createInstagramMedia(apiConfig, {
        image_url: post.content_url,
        caption: `${post.generated_caption}\n\n${post.generated_hashtags || ''}`
      })

      console.log('Media container created:', mediaResponse.id)

      // Шаг 2: Публикуем медиа
      console.log('Publishing media...')
      const publishResponse = await publishInstagramMedia(apiConfig, mediaResponse.id)

      console.log('Media published successfully:', publishResponse.id)

      // Обновляем статус поста на "опубликован"
      await supabaseClient
        .from('instagram_auto_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      console.log(`Successfully published post ${postId}`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Post published successfully via Instagram Graph API',
          published_at: new Date().toISOString(),
          instagram_post_id: publishResponse.id,
          instagram_account: checkData.username
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (apiError) {
      console.error('Instagram API error:', apiError)
      
      // В случае ошибки обновляем статус
      await supabaseClient
        .from('instagram_auto_posts')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      throw new Error(`Instagram API error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error in instagram-graph-api function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Создание медиа контейнера в Instagram
async function createInstagramMedia(config: InstagramApiConfig, mediaData: { image_url: string, caption: string }) {
  const url = `https://graph.facebook.com/v18.0/${config.instagram_account_id}/media`
  
  const params = new URLSearchParams({
    image_url: mediaData.image_url,
    caption: mediaData.caption,
    access_token: config.access_token
  })

  console.log('Creating media with params:', {
    image_url: mediaData.image_url,
    caption_length: mediaData.caption.length,
    instagram_account_id: config.instagram_account_id
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  })

  const responseData = await response.json()
  console.log('Media creation response:', responseData)

  if (!response.ok || responseData.error) {
    const error = responseData.error || { message: `HTTP ${response.status}` }
    throw new Error(`Failed to create media container: ${error.message}`)
  }

  return responseData
}

// Публикация медиа контейнера
async function publishInstagramMedia(config: InstagramApiConfig, creationId: string) {
  const url = `https://graph.facebook.com/v18.0/${config.instagram_account_id}/media_publish`
  
  const params = new URLSearchParams({
    creation_id: creationId,
    access_token: config.access_token
  })

  console.log('Publishing media with creation_id:', creationId)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  })

  const responseData = await response.json()
  console.log('Media publish response:', responseData)

  if (!response.ok || responseData.error) {
    const error = responseData.error || { message: `HTTP ${response.status}` }
    throw new Error(`Failed to publish media: ${error.message}`)
  }

  return responseData
}
