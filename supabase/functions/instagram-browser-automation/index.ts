
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { postId, accountId } = await req.json()
    console.log('Publishing to Instagram account:', accountId)
    console.log('Post ID:', postId)

    // Получаем данные поста
    const { data: post, error: postError } = await supabaseClient
      .from('instagram_auto_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      throw new Error(`Post not found: ${postError?.message}`)
    }

    // Получаем данные аккаунта
    const { data: account, error: accountError } = await supabaseClient
      .from('instagram_accounts')
      .select('*')
      .eq('id', accountId)
      .single()

    if (accountError || !account) {
      throw new Error(`Account not found: ${accountError?.message}`)
    }

    // Проверяем наличие данных для входа
    if (!account.session_data?.encrypted_password) {
      throw new Error('Account login credentials not found. Please add login and password in account settings.')
    }

    console.log('Account found:', account.username)
    console.log('Post content:', post.generated_caption)

    // Симулируем процесс с детальными шагами и "скриншотами"
    const steps = [
      {
        step: 'login',
        message: 'Авторизация в Instagram...',
        progress: 20,
        screenshot: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzNzNkYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkluc3RhZ3JhbSBMb2dpbjwvdGV4dD48L3N2Zz4='
      },
      {
        step: 'upload',
        message: 'Загрузка изображения...',
        progress: 50,
        screenshot: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdmM2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzgzNTNmMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVwbG9hZDwvdGV4dD48L3N2Zz4='
      },
      {
        step: 'caption',
        message: 'Заполнение описания и хештегов...',
        progress: 80,
        screenshot: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmM2UyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y5NzMxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkZGluZyBDYXB0aW9uPC90ZXh0Pjwvc3ZnPg=='
      }
    ]

    // Instagram блокирует автоматизацию, но мы показываем процесс
    console.log('Instagram automation is currently blocked by Instagram anti-bot measures')
    console.log('Simulating publication process with detailed steps...')

    // Обновляем статус поста как запланированный
    const updateResult = await supabaseClient
      .from('instagram_auto_posts')
      .update({
        status: 'scheduled',
        scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    if (updateResult.error) {
      console.error('Error updating post status:', updateResult.error)
    }

    // Обновляем статистику аккаунта
    await supabaseClient
      .from('instagram_accounts')
      .update({
        last_activity: new Date().toISOString()
      })
      .eq('id', accountId)

    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Instagram блокирует автоматизацию. Пост сохранен как запланированный.',
        message: 'Instagram активно блокирует браузерную автоматизацию. Рекомендуем использовать официальный Instagram API или публиковать посты вручную.',
        postStatus: 'scheduled',
        recommendation: 'Используйте Instagram Creator Studio или официальное приложение для публикации постов.',
        steps: steps,
        screenshots: steps.map(s => s.screenshot),
        postContent: {
          caption: post.generated_caption,
          hashtags: post.generated_hashtags,
          imageUrl: post.content_url
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Browser automation error:', error)
    
    // Обновляем статус поста как неудачный
    if (req.json && (await req.json()).postId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )
      
      await supabaseClient
        .from('instagram_auto_posts')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', (await req.json()).postId)
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        type: 'browser_automation_error',
        message: 'Автоматическая публикация в Instagram временно недоступна из-за ограничений платформы.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
