vite.svg:1 
 GET https://memora-frontend-one.vercel.app/vite.svg 404 (Not Found)

memora-frontend-one.vercel.app/:1 Access to XMLHttpRequest at 'https://memora-mvp-production.up.railway.app/api/prompts?sort=recent&page=1&limit=10' from origin 'https://memora-frontend-one.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Home.tsx:34 Error fetching prompts: 
ie {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK', config: {…}, request: XMLHttpRequest, …}
h	@	Home.tsx:34
await in h		
(anonymous)	@	Home.tsx:41
api.ts:88 
 GET https://memora-mvp-production.up.railway.app/api/prompts?sort=recent&page=1&limit=10 net::ERR_FAILED 200 (OK)
getPrompts	@	api.ts:88
h	@	Home.tsx:20
(anonymous)	@	Home.tsx:41
