
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WEBHOOK_VERIFY_TOKEN = "instagram_webhook_2024_verify"

serve(async (req) => {
  console.log(`${req.method} request to: ${req.url}`)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Handle Instagram Webhook Verification (GET request) - no auth required
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    console.log('Webhook verification attempt:', { 
      mode, 
      token, 
      challenge, 
      expectedToken: WEBHOOK_VERIFY_TOKEN,
      allParams: Object.fromEntries(url.searchParams.entries())
    })

    // Verify that this is a webhook verification request
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ Webhook verification successful')
      // Instagram требует только значение challenge в ответе
      return new Response(challenge, { 
        status: 200,
        headers: { 
          'Content-Type': 'text/plain'
          // Убираем CORS заголовки для верификации webhook
        }
      })
    } else {
      console.log('❌ Webhook verification failed:', { 
        mode, 
        receivedToken: token, 
        expectedToken: WEBHOOK_VERIFY_TOKEN,
        modeMatch: mode === 'subscribe',
        tokenMatch: token === WEBHOOK_VERIFY_TOKEN
      })
      return new Response('Verification failed', { 
        status: 403
      })
    }
  }

  // Handle Instagram Webhook Events (POST request) - no auth required
  if (req.method === 'POST') {
    try {
      const body = await req.text()
      console.log('Received webhook event:', body)
      
      // Here you can process Instagram webhook events
      // For now, just acknowledge receipt
      return new Response('OK', { 
        status: 200,
        headers: corsHeaders 
      })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return new Response('Error', { 
        status: 500,
        headers: corsHeaders 
      })
    }
  }

  // Handle OAuth flow - requires authentication
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required for OAuth operations' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const { action, code, state, account_name } = await req.json()

    if (action === 'initiate') {
      // Генерируем URL для OAuth авторизации Instagram
      const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/instagram-oauth`
      const scope = 'user_profile,user_media'
      const state = btoa(JSON.stringify({ user_id: user.user.id, account_name }))
      
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`
      
      return new Response(
        JSON.stringify({ success: true, auth_url: authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'callback' && code) {
      // Обрабатываем callback от Instagram
      const stateData = JSON.parse(atob(state))
      const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
      const clientSecret = Deno.env.get('INSTAGRAM_CLIENT_SECRET')
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/instagram-oauth`

      // Обмениваем code на access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        }),
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token')
      }

      // Получаем долгосрочный токен
      const longLivedTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`)
      const longLivedTokenData = await longLivedTokenResponse.json()

      // Получаем информацию о пользователе
      const userInfoResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedTokenData.access_token}`)
      const userInfo = await userInfoResponse.json()

      // Сохраняем аккаунт в базе данных
      const { data: account, error } = await supabaseClient
        .from('instagram_accounts')
        .upsert({
          user_id: stateData.user_id,
          username: userInfo.username,
          name: stateData.account_name || userInfo.username,
          oauth_access_token: longLivedTokenData.access_token,
          oauth_token_expires_at: new Date(Date.now() + (longLivedTokenData.expires_in * 1000)).toISOString(),
          oauth_connected_at: new Date().toISOString(),
          oauth_provider: 'instagram',
          status: 'active',
          posts_count: userInfo.media_count || 0,
          use_for_posting: true
        }, {
          onConflict: 'user_id,username'
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving account:', error)
        throw new Error('Failed to save account')
      }

      return new Response(
        JSON.stringify({ success: true, account }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'disconnect' && account_name) {
      // Отключение аккаунта
      const { error } = await supabaseClient
        .from('instagram_accounts')
        .update({
          oauth_access_token: null,
          oauth_refresh_token: null,
          oauth_token_expires_at: null,
          oauth_connected_at: null,
          status: 'inactive'
        })
        .eq('user_id', user.user.id)
        .eq('username', account_name)

      if (error) {
        throw new Error('Failed to disconnect account')
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
