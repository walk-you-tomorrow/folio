import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Folio — Your thoughts, unfolded together.',
  description:
    '회원가입 없이 링크 하나로 입장하여, 무한 캔버스 위에 텍스트·그림·사진을 자유롭게 올리고 실시간으로 함께 보는 즉석 협업 메모장',
  openGraph: {
    title: 'Folio',
    description: '링크 하나로 바로 시작하는 무한 캔버스 협업',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
