"use client"

import React, { useEffect } from 'react'
import Script from 'next/script';
import Image from 'next/image';

const MetaPixel = () => {

    useEffect(() => {
        if (!window.fbq) {
          window.fbq = function () {
            window.fbq.callMethod
              ? window.fbq.callMethod.apply(window.fbq, arguments)
              : window.fbq.queue.push(arguments);
          };
          window.fbq.push = window.fbq;
          window.fbq.loaded = true;
          window.fbq.version = '2.0';
          window.fbq.queue = [];
          window.fbq('init', '1130824121461033');
          window.fbq('track', 'PageView');
        }
      }, []);
    
      return (
        <>
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1130824121461033');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
        <Image
            alt="meta pixel"
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1130824121461033&ev=PageView&noscript=1"
        />
      </noscript>
      </>  
      );
    };

export default MetaPixel