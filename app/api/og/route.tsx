import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'KanaDojo';
    const description =
      searchParams.get('description') || 'Learn Japanese Online';
    const type = searchParams.get('type') || 'default';

    // Gradient backgrounds based on type
    const gradients = {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      kana: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      kanji: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      vocabulary: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      academy: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };

    const gradient =
      gradients[type as keyof typeof gradients] || gradients.default;

    return new ImageResponse(
      <div
        style={{
          background: gradient,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            KanaDojo
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            maxWidth: '900px',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
              textShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            {description}
          </div>
        )}

        {/* Bottom Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '16px 28px',
            borderRadius: '50px',
            fontSize: '24px',
            color: 'white',
            fontWeight: '600',
          }}
        >
          🎌 Free Japanese Learning Platform
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        // Cache OG images at CDN for 24 hours, allow stale for 7 days
        headers: {
          'Cache-Control':
            'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return new Response(
      `Failed to generate image: ${error.message || 'Unknown error'}`,
      {
        status: 500,
      },
    );
  }
}
