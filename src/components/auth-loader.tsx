

interface LoaderProps {
  message?: string;
}

/**
 * Authentication loader component with pulsing circle
 */
export function AuthLoader({ message = "Just a moment..." }: LoaderProps) {
  const html = `
    <div style="
      min-height: 100vh;
      background-color: #f9fafb;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    ">
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      ">
        <!-- Pulsing circle loader -->
        <div style="
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-color: #3b82f6;
          opacity: 0.8;
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        
        <!-- Loading message -->
        <p style="
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
          text-align: center;
          font-family: ui-sans-serif, system-ui, sans-serif;
        ">${message}</p>
      </div>
      
      <!-- Client-side redirect script -->
      <script>
        // Check if user is authenticated by looking for id cookie
        function getCookie(name) {
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return value;
          }
          return null;
        }
        
        const userId = getCookie('id');
        if (!userId) {
          // Not authenticated, redirect to login after showing loader briefly
          setTimeout(() => {
            const currentPath = window.location.pathname + window.location.search;
            const loginUrl = '/auth/login?redirect=' + encodeURIComponent(currentPath);
            window.location.href = loginUrl;
          }, 1500); // Show loader for 1.5 seconds
        } else {
          // Authenticated, reload to get user data from server
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Brief loader then reload
        }
      </script>
    </div>
  `;
  
  return { __html: html };
}