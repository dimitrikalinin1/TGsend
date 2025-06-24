
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { postId, publishNow } = await req.json()

    if (!postId) {
      throw new Error('postId is required')
    }

    // Получаем данные поста
    const { data: post, error: postError } = await supabaseClient
      .from('instagram_auto_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      throw new Error('Post not found')
    }

    if (post.status !== 'generated') {
      throw new Error('Post must be generated first')
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (publishNow) {
      // Мгновенная публикация
      updateData.status = 'published'
      updateData.published_at = new Date().toISOString()
      console.log(`Post ${postId} published immediately`)
    } else {
      // Планирование публикации
      updateData.status = 'scheduled'
      console.log(`Post ${postId} scheduled for ${post.scheduled_at}`)
    }

    // Обновляем статус поста
    const { error: updateError } = await supabaseClient
      .from('instagram_auto_posts')
      .update(updateData)
      .eq('id', postId)

    if (updateError) {
      throw updateError
    }

    // Здесь в будущем можно добавить интеграцию с Instagram API
    // для автоматической публикации

    return new Response(
      JSON.stringify({
        success: true,
        message: publishNow ? 'Post published immediately' : 'Post scheduled successfully',
        published_at: publishNow ? updateData.published_at : null,
        scheduled_at: publishNow ? null : post.scheduled_at
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in schedule-instagram-post function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
