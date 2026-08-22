export const config = {
  matcher: '/:path*',
};

const HOLDING_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Mr. Home — Site Temporarily Unavailable</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    height: 100%;
    background: #000000;
    color: #FAFAFA;
    font-family: Georgia, 'Times New Roman', serif;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }
  .wrap { max-width: 560px; }
  .brand {
    font-size: 14px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #E9C91C;
    margin-bottom: 28px;
    font-family: Arial, sans-serif;
  }
  h1 {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 400;
    line-height: 1.3;
    margin-bottom: 20px;
  }
  h1 span { color: #E9C91C; }
  p {
    font-family: Arial, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #cfcfcf;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="brand">Mr. Home</div>
    <h1>We'll be <span>back shortly</span></h1>
    <p>Our website is temporarily unavailable. Please check back soon, or reach out to us directly for any urgent inquiries.</p>
  </div>
</body>
</html>`;

export default function middleware() {
  return new Response(HOLDING_PAGE, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
      'Cache-Control': 'no-store',
    },
  });
}
