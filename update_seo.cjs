const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const headSEO = `
    <!-- Multilingual SEO & AEO -->
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://tiresias.guru" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tiresias Oracle | Moments of Reflection and Inner Peace" />
    <meta property="og:description" content="Tiresias is a digital space for pause and mindfulness. Access deep reflections, find emotional comfort, and embrace new beginnings through contemplative messages." />
    <meta property="og:url" content="https://tiresias.guru" />
    <meta property="og:image" content="https://tiresias.guru/og-image.jpg" />
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Tiresias Oracle | Moments of Reflection and Inner Peace" />
    <meta name="twitter:description" content="Tiresias is a digital space for pause and mindfulness. Access deep reflections, find emotional comfort, and embrace new beginnings through contemplative messages." />
    <meta name="twitter:image" content="https://tiresias.guru/og-image.jpg" />

    <!-- Keyword SEO -->
    <meta name="keywords" content="conforto emocional, reflexão, autoconhecimento, mensagens de apoio, recomeço, esperança, propósito, contemplação, desenvolvimento pessoal, como lidar com a dor da perda, mensagens de conforto, palavras de apoio, como superar um término, sensação de vazio, como seguir em frente, mensagem para hoje, conselho para hoje, como ter esperança novamente, como lidar com a solidão, como encontrar forças para continuar" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://tiresias.guru/#website",
          "url": "https://tiresias.guru",
          "name": "Tiresias Oracle",
          "description": "A digital space for pause, mindfulness, and deep reflection."
        },
        {
          "@type": "Organization",
          "@id": "https://tiresias.guru/#organization",
          "name": "Tiresias Oracle",
          "url": "https://tiresias.guru"
        },
        {
          "@type": "AboutPage",
          "@id": "https://tiresias.guru/#about",
          "url": "https://tiresias.guru",
          "name": "About Tiresias"
        },
        {
          "@type": "FAQPage",
          "@id": "https://tiresias.guru/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Does Tiresias predict the future?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. The project does not make predictions. Tiresias offers reflections to help you find emotional comfort and self-knowledge in your present."
              }
            },
            {
              "@type": "Question",
              "name": "Is Tiresias religious?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. The project has no religious affiliation. It draws inspiration from Greek mythology purely as a narrative element."
              }
            },
            {
              "@type": "Question",
              "name": "Does Tiresias replace professional psychological help?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Tiresias does not replace medical, psychological, or professional advice. It is a contemplative tool for personal support."
              }
            },
            {
              "@type": "Question",
              "name": "Can Tiresias help during grief or after a breakup?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tiresias provides comforting messages that might inspire hope and emotional support during difficult times, such as loss or the end of cycles, serving as a space for reflection."
              }
            },
            {
              "@type": "Question",
              "name": "Is Tiresias based on Greek mythology?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, but only in its naming and narrative aesthetic. Tiresias was a blind prophet in Greek mythology, known for seeing what others could not. Here, it represents looking inward."
              }
            },
            {
              "@type": "Question",
              "name": "How are the messages generated?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Messages are drawn from an extensive curated collection of reflections and insights designed to provide emotional comfort, hope, and support for a new beginning."
              }
            },
            {
              "@type": "Question",
              "name": "Does the site work in multiple languages?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Tiresias is available globally in several languages to offer contemplation and support to people anywhere."
              }
            },
            {
              "@type": "Question",
              "name": "Can Tiresias be used for personal reflection?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. It is designed exactly for moments of pause, deep self-knowledge, and personal development."
              }
            }
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://tiresias.guru/#app",
          "name": "Tiresias Oracle",
          "url": "https://tiresias.guru",
          "applicationCategory": "HealthAndFitnessApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0"
          }
        },
        {
          "@type": "CreativeWork",
          "@id": "https://tiresias.guru/#work",
          "name": "Tiresias Meditations"
        }
      ]
    }
    </script>
`;

// Remove existing ld+json script blocks inside head
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
// Replace <!-- Multilingual SEO & AEO -->
html = html.replace(/<!-- Multilingual SEO & AEO -->/, headSEO);

fs.writeFileSync('index.html', html);
console.log('SEO updated');
