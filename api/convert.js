// api/convert.js – Secure backend for PDF/Excel/Word conversion
// Aapke API keys sirf Vercel Environment Variables se aayenge – frontend ko kabhi nahi pata chalega

export default async function handler(req, res) {
  // CORS – Sirf aapki site allow karein
  res.setHeader('Access-Control-Allow-Origin', 'https://convertguru.in');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { fileUrl, action } = req.body;

  if (!fileUrl || !action) {
    return res.status(400).json({ error: 'fileUrl and action are required' });
  }

  try {
    let response;

    // ====== ADOBE CONVERTERS (PDF ↔ Word/Excel) ======
    if (action === 'pdf-to-word') {
      response = await fetch('https://cpf-ue1.adobe.io/ops/:create?respondWith=%7B%22reltype%22%3A%22http%3A%2F%2Fns.adobe.com%2Frel%2Fconversion%22%7D', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADOBE_ACCESS_TOKEN}`,
          'x-api-key': process.env.ADOBE_CLIENT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cpf:inputs": {
            "documentIn": {
              "dc:format": "application/pdf",
              "cpf:location": fileUrl
            }
          },
          "cpf:engine": {
            "repo:assetId": "urn:aaid:cpf:Service-df1f6e5d5d4b4a899b5c6e1c9e5e4e6f"
          },
          "cpf:outputs": {
            "documentOut": {
              "dc:format": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "cpf:location": "multipartLabel"
            }
          }
        })
      });
    }
    else if (action === 'pdf-to-excel') {
      response = await fetch('https://cpf-ue1.adobe.io/ops/:create?respondWith=%7B%22reltype%22%3A%22http%3A%2F%2Fns.adobe.com%2Frel%2Fconversion%22%7D', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADOBE_ACCESS_TOKEN}`,
          'x-api-key': process.env.ADOBE_CLIENT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cpf:inputs": {
            "documentIn": {
              "dc:format": "application/pdf",
              "cpf:location": fileUrl
            }
          },
          "cpf:engine": {
            "repo:assetId": "urn:aaid:cpf:Service-1538ece812254acaac2a866c97b22b5d"
          },
          "cpf:outputs": {
            "documentOut": {
              "dc:format": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "cpf:location": "multipartLabel"
            }
          }
        })
      });
    }
    else if (action === 'word-to-pdf') {
      response = await fetch('https://cpf-ue1.adobe.io/ops/:create?respondWith=%7B%22reltype%22%3A%22http%3A%2F%2Fns.adobe.com%2Frel%2Fconversion%22%7D', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADOBE_ACCESS_TOKEN}`,
          'x-api-key': process.env.ADOBE_CLIENT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cpf:inputs": {
            "documentIn": {
              "dc:format": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "cpf:location": fileUrl
            }
          },
          "cpf:engine": {
            "repo:assetId": "urn:aaid:cpf:Service-8d39e33f6a334f8a8c5c6c75a1c9d6e5"
          },
          "cpf:outputs": {
            "documentOut": {
              "dc:format": "application/pdf",
              "cpf:location": "multipartLabel"
            }
          }
        })
      });
    }
    else if (action === 'excel-to-pdf') {
      response = await fetch('https://cpf-ue1.adobe.io/ops/:create?respondWith=%7B%22reltype%22%3A%22http%3A%2F%2Fns.adobe.com%2Frel%2Fconversion%22%7D', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADOBE_ACCESS_TOKEN}`,
          'x-api-key': process.env.ADOBE_CLIENT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cpf:inputs": {
            "documentIn": {
              "dc:format": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "cpf:location": fileUrl
            }
          },
          "cpf:engine": {
            "repo:assetId": "urn:aaid:cpf:Service-3b6e0c7d8e9f0a1b2c3d4e5f6a7b8c9d"
          },
          "cpf:outputs": {
            "documentOut": {
              "dc:format": "application/pdf",
              "cpf:location": "multipartLabel"
            }
          }
        })
      });
    }
    else if (action === 'ppt-to-pdf') {
      response = await fetch('https://cpf-ue1.adobe.io/ops/:create?respondWith=%7B%22reltype%22%3A%22http%3A%2F%2Fns.adobe.com%2Frel%2Fconversion%22%7D', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADOBE_ACCESS_TOKEN}`,
          'x-api-key': process.env.ADOBE_CLIENT_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "cpf:inputs": {
            "documentIn": {
              "dc:format": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "cpf:location": fileUrl
            }
          },
          "cpf:engine": {
            "repo:assetId": "urn:aaid:cpf:Service-9f8e7d6c5b4a3c2d1e0f9a8b7c6d5e4f"
          },
          "cpf:outputs": {
            "documentOut": {
              "dc:format": "application/pdf",
              "cpf:location": "multipartLabel"
            }
          }
        })
      });
    }

    // ====== BLAZE PDF (Fallback or if needed) ======
    else if (action === 'blaze-word-to-pdf') {
      response = await fetch('https://api.blazepdf.com/v1/convert/word-to-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BLAZE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: fileUrl })
      });
    }
    else if (action === 'blaze-excel-to-pdf') {
      response = await fetch('https://api.blazepdf.com/v1/convert/excel-to-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BLAZE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: fileUrl })
      });
    }
    else if (action === 'blaze-ppt-to-pdf') {
      response = await fetch('https://api.blazepdf.com/v1/convert/powerpoint-to-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BLAZE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: fileUrl })
      });
    }
    else {
      return res.status(400).json({ error: 'Unsupported action' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Conversion error:', err.message);
    res.status(500).json({ error: 'Conversion failed', message: err.message });
  }
}
