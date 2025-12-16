<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>乐理学习王 - Music Theory King</title>
    <meta name="theme-color" content="#f97316" />
    <meta name="description" content="Master music theory with interactive tools." />
    
    <!-- iOS PWA Config -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Music Theory">
    <meta name="format-detection" content="telephone=no">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="./icon.svg" />
    <link rel="manifest" href="./manifest.json" />
    
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        tech: ['"Chakra Petch"', 'sans-serif'],
                    },
                    colors: {
                        zinc: {
                            950: '#09090b',
                        }
                    }
                }
            }
        }
    </script>
    <style>
      body {
        overscroll-behavior-y: none;
        -webkit-tap-highlight-color: transparent;
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        background-color: #f97316;
      }
      .font-tech-title { font-family: 'Chakra Petch', sans-serif; }
      
      /* Loading Pulse */
      @keyframes pulse-slow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(0.95); }
      }
      .loading-icon {
        animation: pulse-slow 2s infinite ease-in-out;
      }
    </style>

    <!-- Import Map: FIXED - REMOVED REACT 19 -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "lucide-react": "https://esm.sh/lucide-react@0.294.0?deps=react@18.2.0"
      }
    }
    </script>

    <!-- iOS Icon Generator -->
    <script>
      (function() {
        var link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        document.head.appendChild(link);
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#f97316';
          ctx.fillRect(0, 0, 512, 512);
          ctx.drawImage(img, 0, 0, 512, 512);
          link.href = canvas.toDataURL('image/png');
        };
        img.src = './icon.svg';
      })();
    </script>

    <!-- iOS Standalone Fix -->
    <script>
      window.addEventListener('load', function() {
        document.addEventListener('touchmove', function(e) {
          if (e.scale !== 1) { e.preventDefault(); }
        }, { passive: false });

        if (window.navigator.standalone) {
          document.body.addEventListener('click', function(e) {
            var target = e.target;
            while (target && target.tagName !== 'A') {
              target = target.parentNode;
            }
            if (target && target.href && target.href.indexOf(location.host) !== -1 && !target.getAttribute('download')) {
              e.preventDefault();
              window.location.href = target.href;
            }
          }, false);
        }
      });
    </script>
    
    <script>
      window.deferredPrompt = null;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
      });
    </script>

    <!-- Babel Standalone -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
  <body class="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    <div id="root" class="h-screen w-full flex items-center justify-center bg-orange-500">
      <!-- Placeholder SVG while React loads -->
      <img src="./icon.svg" class="w-32 h-32 loading-icon" alt="Loading..." />
    </div>

    <script type="text/babel" data-type="module" data-presets="react,typescript">
      import React from 'react';
      import ReactDOM from 'react-dom/client';
      // IMPORTANT: Importing .tsx file which imports .js modules
      import App from './App.tsx';

      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
              console.log('SW registered scope:', registration.scope);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }

      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    </script>
  </body>
</html>
