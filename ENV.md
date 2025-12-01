# Environment Variables

Create a `.env.local` file in the root directory with the following variables:

## Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## OpenAI Configuration
```
OPENAI_API_KEY=your_openai_api_key
```

## National Park Service API
```
NPS_API_KEY=your_nps_api_key
```

## Google Maps & Directions API
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_DIRECTIONS_API_KEY=your_google_directions_api_key
```

## Stripe Configuration
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## OpenWeather API
```
OPENWEATHER_API_KEY=your_openweather_api_key
```

## Notes

- `.env.local` is already in `.gitignore` and will not be committed
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Server-side only variables (like `SUPABASE_SERVICE_ROLE_KEY`) should never be exposed to the client
- For production, set these variables in your deployment platform (e.g., Vercel)

