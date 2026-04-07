import { Liveblocks } from '@liveblocks/node';
import { AVATAR_COLORS } from '@/lib/types';

function getLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error('LIVEBLOCKS_SECRET_KEY가 설정되지 않았어요.');
  }
  return new Liveblocks({ secret });
}

export async function POST(request: Request) {
  const liveblocks = getLiveblocks();
  const { room } = await request.json();

  const colorIndex = Math.floor(Math.random() * AVATAR_COLORS.length);

  const session = liveblocks.prepareSession(`user-${crypto.randomUUID().slice(0, 8)}`, {
    userInfo: {
      nickname: '익명',
      color: AVATAR_COLORS[colorIndex],
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
