- Install supabase dev tools: `pnpm install supabase --save-dev`
- Login supabase: `npx supabase login`
- To generate types:
    - get the project id, from the url of the **supabase dashboard**:  
    `https://supabase.com/dashboard/project/<project_id>/`
    - Execute this command, to output types into `types/supabase.ts`:  
    `npx supabase gen types typescript --project-id <project_id> --schema public > types/supabase.ts`
    - Add `these lines` at the end of the generated types file, for fast type hinting:
    ```typescript
    export type DBShopifyPartner = Database['public']['Tables']['shopify_partner']['Insert'];
    export type DBShopifyAppCategory = Database['public']['Tables']['shopify_app_category']['Insert'];
    export type DBShopifyAppDetail = Database['public']['Tables']['shopify_app_info']['Insert'];
    export type DBShopifyAppReview = Database['public']['Tables']['shopify_app_reviews']['Insert'];
    export type DBShopifyPricingPlan = Database['public']['Tables']['shopify_pricing_plan']['Insert'];
    export type DBShopifyCategoryRankLog = Database['public']['Tables']['shopify_category_rank_log']['Insert'];
    export type DBShopifyAppDescriptionLog = Database['public']['Tables']['shopify_app_description_log']['Insert'];
    export type DBShopifyCommunityUserStats = Database['public']['Tables']['shopify_community_user_stats']['Insert'];
    export type DBShopifyCommunityUserStatsLog = Database['public']['Tables']['shopify_community_user_stats_log']['Insert'];
    export type DBIndexEntityTable = DBShopifyPartner | DBShopifyAppCategory | DBShopifyAppDetail
    ```