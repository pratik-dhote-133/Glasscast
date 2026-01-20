# AI / Claude Usage Notes (Glasscast)

This project was built as part of BrewApps screening assignment.

## AI Tools Used
- ChatGPT (assisted in implementation planning and development guidance)

## Where AI Assistance Was Used
- Designing project folder structure and modular file separation
- Implementing Expo Router navigation structure
- Creating Supabase Auth flows (Login/Register/Session handling)
- Creating Supabase database schema + RLS policy SQL
- Implementing OpenWeather API integration (current weather + forecast)
- Optimizing UI with glassmorphism style approach
- Refactoring app logic for global unit toggle (°C/°F)
- Implementing favorites system with Supabase storage and display

## What Was Verified Manually
- API key and Supabase configuration setup
- UI testing across Home, Search, Settings
- Auth flow validation (Signup/Login/Logout)
- Favorites insert/select/delete working with RLS
- Unit toggle affecting both Home and Search correctly

## Development Decisions
- Used OpenWeatherMap API for stable global weather data
- Used Supabase for authentication + database storage
- Used Expo Router tabs for clean navigation
- Implemented RLS policies to ensure user data privacy
- Designed UI with glass cards and dark gradient background

## Notes
- The implementation is optimized to run on Web and Mobile.
- AsyncStorage is used on mobile, and localStorage fallback is used for web session handling.
