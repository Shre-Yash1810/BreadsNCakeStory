import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const upiUrl = 'upi://pay?pa=8788674006@okbizaxis&pn=BREADS%26CAKESTORY';
  
  // Return an HTML response that redirect to the UPI app using both meta refresh and JavaScript
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting to Payment...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="0;url=${upiUrl}" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f9f9f9;
            color: #333;
            text-align: center;
            padding: 20px;
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #d4af37; /* Luxury gold matching your brand */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .btn {
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #d4af37;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <h2>Opening your UPI Payment App...</h2>
        <p>If your app doesn't open automatically, click the button below:</p>
        <a class="btn" href="${upiUrl}">Pay Now</a>
        <script>
          // Automatic redirect trigger
          setTimeout(function() {
            window.location.href = "${upiUrl}";
          }, 100);
        </script>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
