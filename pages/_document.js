import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // A combined SVG icon featuring a blue calendar with a green checkmark and a clock.
  // This is encoded as a Data URI for direct use in the browser tab.
  const appointmentLogoSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
    <path d='M50 10H44V6a2 2 0 0 0-4 0v4H24V6a2 2 0 0 0-4 0v4H14a4 4 0 0 0-4 4v36a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4zm0 40H14V20h36v30z' fill='%231e40af'/>
    
    <rect x='18' y='26' width='6' height='6' rx='1' fill='%231e40af'/>
    <rect x='28' y='26' width='6' height='6' rx='1' fill='%231e40af'/>
    <rect x='38' y='26' width='6' height='6' rx='1' fill='%231e40af'/>
    <rect x='18' y='36' width='6' height='6' rx='1' fill='%231e40af'/>
    <rect x='28' y='36' width='6' height='6' rx='1' fill='%231e40af'/>
    
    <path d='M43.3 32.3L36 39.6l-3.3-3.3a2.5 2.5 0 0 0-3.5 3.5l5 5a2.5 2.5 0 0 0 3.5 0l9-9a2.5 2.5 0 0 0-3.5-3.5z' fill='%2316a34a'/>

    <g transform='translate(28, 28)'>
      <circle cx='20' cy='20' r='16' fill='white' stroke='%231e40af' stroke-width='4'/>
      <path d='M20 10v10l6 6' stroke='%231e40af' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' fill='none'/>
    </g>
  </svg>`;

  return (
    <Html lang="en">
      <Head>
        {/* Use the custom Appointment Logo SVG */}
        <link rel="icon" type="image/svg+xml" href={appointmentLogoSvg} />
        <title>Appointment Booking</title>
        <meta name="description" content="Schedule your appointments easily." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}