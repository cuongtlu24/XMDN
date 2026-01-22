import './globals.css'

export const metadata = {
  title: 'Hệ thống tra cứu doanh nghiệp',
  description: 'Xác minh thông tin doanh nghiệp tự động',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
