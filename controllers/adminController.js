exports.getPrompts = (req, res) => {
  console.log('getPrompts')
  res.json({
    web_searches: [
      {
        text: 'Find PepsiCo company financial report',
        active: true,
      }
    ],
    goose_prompts: [
  {
    text: '🛑 Goose is temporarily unavailable. You can still admire its feathers though.',
    active: false,
  }
],
    // goose_prompts: [
    //   {
    //     text: 'Retrieve last year Gross and Net profit margins. Return as JSON with "gross" and "net" fields.',
    //     active: true,
    //   }
    // ],
  });
};

const https = require('https');
const { exec } = require('child_process');

function extractWebSearchResult(response) {
  try {
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      const parts = response.candidates[0].content.parts;
      if (parts && parts[0] && parts[0].text) {
        return parts[0].text;
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting web search result:', error);
    return null;
  }
}

exports.setPrompts = (req, res) => {
  console.log(`Received: ${req.body.web_searches}`);

  console.log('Doing Web Search...');

  // Filter active prompts and extract their text
  const webSearchQuery = req.body.web_searches
    .filter(prompt => prompt.active)
    .map(prompt => prompt.text)
    .join(' ');

  console.log(`Web Search query: ${webSearchQuery}`);

  // Actual Web Search
  const geminiApiKey = process.env.GEMINI_API_KEY; // Assuming you have the API key in environment variables
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
  const geminiData = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: webSearchQuery
          }
        ]
      }
    ]
  });

  const webSearchPromise = new Promise((resolve, reject) => {
    const geminiReq = https.request(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (geminiRes) => {
      let geminiResponseData = '';

      geminiRes.on('data', (chunk) => {
        geminiResponseData += chunk;
      });

      geminiRes.on('end', () => {
        try {
          const parsedGeminiResponse = JSON.parse(geminiResponseData);
          resolve(parsedGeminiResponse);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });

    geminiReq.write(geminiData);
    geminiReq.end();
  });

  Promise.all([webSearchPromise])
    .then(([webSearchResult]) => {
        console.debug("Web Search result:", webSearchResult);

        const extractedResponse = extractWebSearchResult(webSearchResult);
      res.json({
        web_search_result: extractedResponse || null,
      });
    })
    .catch(errors => {
      console.error("Web Search promise rejected:", errors);
      res.status(500).json({ error: "An error occurred during Web Search execution." });
    });
};

function extractGooseResponse(gooseOutput) {
  if (!gooseOutput || typeof gooseOutput !== 'string') {
    return null;
  }

  // Split by lines and find the actual response
  const lines = gooseOutput.split('\n');

  // Look for the line that contains the actual response (after ANSI color codes)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Remove ANSI color codes (like [38;2;222;222;222m and [0m)
    // Remove ANSI escape sequences and ESC characters
    let cleanLine = line
      .replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI color codes (ESC[...m)
      .replace(/\x1b/g, '') // Remove standalone ESC characters
      .replace(/\u001b\[[0-9;]*m/g, '') // Alternative ANSI format
      .replace(/\u001b/g, '') // Alternative ESC format
      .trim();

    // Skip system messages (lines containing session info, logging, working directory)
    if (cleanLine.includes('starting session') ||
        cleanLine.includes('logging to') ||
        cleanLine.includes('working directory') ||
        cleanLine.includes('provider:') ||
        cleanLine.includes('model:')) {
      continue;
    }

    // Return the first non-system message we find
    if (cleanLine) {
      return cleanLine;
    }
  }

  return null;
}

exports.runGoose = (req, res) => {
  const sleepyMessages = [
    "🪶 Goose is taking a nap, please don't disturb... 😴",
    "🐤 Goose is offline for emotional maintenance.",
    "🧘 Goose went to meditate by the lake of answers.",
    "📵 Goose is unavailable. Exploring a life without prompts.",
    "🛌 Goose is sleeping on the cloud. Please check back later.",
  ];

  const message = sleepyMessages[Math.floor(Math.random() * sleepyMessages.length)];

  res.status(200).json({ goose: message });
};

// Updated runGoose function with extraction
// exports.runGoose = (req, res) => {
//   console.log(`Received: ${req.body.web_searches}, ${req.body.goose_prompts}`);

//   console.log('Running Goose prompt...');

//   // Filter active prompts and extract their text
//   const activePrompts = req.body.goose_prompts
//     .filter(prompt => prompt.active)
//     .map(prompt => prompt.text);

//   // Join multiple active prompts with a separator, or use the first one
//   goose_prompt = activePrompts.length > 0 ? activePrompts.join(' ') : '';

//   // Handle case where no active prompts exist
//   if (!goose_prompt) {
//     return res.status(400).json({ error: "No active prompts found" });
//   }

//   const gooseCliCommand = `goose run -t "${goose_prompt}"`; // Assuming 'goose' is in the system's PATH

//   const goosePromise = new Promise((resolve, reject) => {
//     exec(gooseCliCommand, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//       } else {
//         try {
//             const parsedGooseResponse = JSON.parse(stdout);
//             resolve(parsedGooseResponse);
//         } catch (parseError) {
//             resolve(stdout);
//         }
//       }
//     });
//   });

//   Promise.all([goosePromise])
//     .then(([goosePromptResult]) => {
//         console.debug("Goose result:", goosePromptResult);

//         // Extract the actual response from Goose output
//         const extractedResponse = extractGooseResponse(goosePromptResult);

//       res.json({
//         goose: extractedResponse || null,
//       });
//     })
//     .catch(errors => {
//       console.error("The promise rejected:", errors);
//       res.status(500).json({ error: "An error occurred during Goose execution." });
//     });
// };