// src/app/api/health/route.ts
export async function GET() {
  return Response.json(
    {
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}