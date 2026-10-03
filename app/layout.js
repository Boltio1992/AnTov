import './globals.css';

export const metadata = {
  title: 'AnTov — Horror Reading',
  description: 'Read horror, one shift at a time.',
  manifest: '/manifest.json'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#101216'
};

const themeScript = `(function(){try{
  var t=localStorage.getItem('an_tov_theme')||'night';
  document.documentElement.dataset.theme=t;
  var f=localStorage.getItem('an_tov_fs'); if(f) document.documentElement.style.setProperty('--fs',f+'px');
  var l=localStorage.getItem('an_tov_lh'); if(l) document.documentElement.style.setProperty('--lh',(l/10));
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="night" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
