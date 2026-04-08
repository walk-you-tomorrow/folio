import { Liveblocks } from '@liveblocks/node';
import { AVATAR_COLORS } from '@/lib/types';

function getLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    return null;
  }
  return new Liveblocks({ secret });
}

export async function POST(request: Request) {
  const liveblocks = getLiveblocks();
  if (!liveblocks) {
    return Response.json(
      { error: { code: 'CONFIG_ERROR', message: '실시간 연결 설정을 확인하고 있어요. 잠시 후 다시 시도해주세요.' } },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: 'INVALID_REQUEST', message: '요청을 읽을 수 없었어요.' } },
      { status: 400 },
    );
  }

  const { room } = body;
  if (!room || typeof room !== 'string' || !room.startsWith('canvas-')) {
    return Response.json(
      { error: { code: 'INVALID_ROOM', message: '올바르지 않은 캔버스 정보예요.' } },
      { status: 400 },
    );
  }

  try {
    const colorIndex = Math.floor(Math.random() * AVATAR_COLORS.length);

    const session = liveblocks.prepareSession(`user-${crypto.randomUUID().slice(0, 8)}`, {
      userInfo: {
        nickname: '익명',
        color: AVATAR_COLORS[colorIndex],
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { status, body: authBody } = await session.authorize();
    return new Response(authBody, { status });
  } catch {
    return Response.json(
      { error: { code: 'AUTH_FAILED', message: '실시간 연결을 시작하지 못했어요. 새로고침해보세요.' } },
      { status: 500 },
    );
  }
}
