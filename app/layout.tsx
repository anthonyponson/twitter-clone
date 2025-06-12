
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Twitter Clone</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-950 text-white font-sans antialiased">
        <div className="h-screen ">
          <div className="container h-full max-w-6xl mx-auto xl:px-30">
            <div className="grid grid-cols-4 h-full">
             

              <div className="col-span-3 lg:col-span-2 hidden lg:block border-l border-gray-800">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
