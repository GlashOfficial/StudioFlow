// background.js

const endpoint = "http://44.202.141.139"

chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Studio Enhancer extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background script:', request);

  if (request.type === 'FETCH_CAPTIONS') {
    console.log('Processing captions fetch request:', request.videoId);
    fetchYoutubeCaptions(request.videoId)
      .then(response => {
        console.log('Captions fetch response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Captions fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'FETCH_COMMENTS') {
    console.log('Processing comments fetch request:', request.videoId);
    fetchYoutubeComments(request.videoId)
      .then(response => {
        console.log('Comments fetch response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Comments fetch error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'GENERATE_CONTENT') {
    console.log('Processing content generation request:', request.data);
    handleContentGeneration(request.data)
      .then(response => {
        console.log('Content generation response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Content generation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'ENHANCE_CONTENT') {
    console.log('Processing content enhancement request:', request.data);
    handleContentEnhancement(request.data)
      .then(response => {
        console.log('Content enhancement response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Content enhancement error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'SUMMARIZE_COMMENTS') {
    console.log('Processing comments summarization request:', request.data);
    handleCommentsSummarization(request.data)
      .then(response => {
        console.log('Comments summarization response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Comments summarization error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
}
});

async function fetchYoutubeCaptions(videoId) {
  try {
    console.log('Fetching captions for video ID:', videoId);
    
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const pageText = await videoPageResponse.text();
    
    const playerResponseMatch = pageText.match(/var ytInitialPlayerResponse\s*=\s*({.*?});/);
    if (!playerResponseMatch) {
      throw new Error('Could not find player response');
    }

    const playerResponse = JSON.parse(playerResponseMatch[1]);
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    
    const autoCaptions = captionTracks
      .filter(track => track.kind === 'asr')
      .map(track => ({
        languageCode: track.languageCode,
        baseUrl: track.baseUrl
      }));

    if (autoCaptions.length === 0) {
      throw new Error('No auto-generated captions found');
    }

    const captionsResponse = await fetch(autoCaptions[0].baseUrl);
    const captionsXml = await captionsResponse.text();

    // Parse XML manually without using DOMParser
    const texts = [];
    const xmlRegex = /<text start="([\d.]+)" dur="([\d.]+)">(.*?)<\/text>/g;
    let match;

    while ((match = xmlRegex.exec(captionsXml)) !== null) {
      texts.push({
        start: parseFloat(match[1]),
        duration: parseFloat(match[2]),
        text: match[3].replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'")
                     .trim()
      });
    }

    return texts;
  } catch (error) {
    console.error('Error fetching YouTube captions:', error);
    throw error;
  }
}


  async function fetchYoutubeComments(videoId, maxComments = 100, apiKey) {
    const array = ['AIzaSyDbUBsNlFO3zadkcMIoqAD1Ndm9G4Ww3AI', 'AIzaSyDFV_Q1wbk7VF5Ep87mwjMfiB-tNtiUREM','AIzaSyCMLP23ojecYjBlGSZ0sMXGdTy9fF-OIR4'];


    const randomIndex = Math.floor(Math.random() * array.length);


    apiKey = array[randomIndex];

    console.log(apiKey);

  
    if (!apiKey) {
      throw new Error('API key is required for using YouTube Data API v3.');
    }
  
    const apiUrl = 'https://www.googleapis.com/youtube/v3/commentThreads';
    const comments = [];
    let fetchedCommentsCount = 0;
    let nextPageToken = null;
  
    const fetchCommentsPage = async (pageToken = null) => {
      const url = new URL(apiUrl);
      url.searchParams.append('part', 'snippet');
      url.searchParams.append('videoId', videoId);
      url.searchParams.append('maxResults', '100'); // Max allowed by the API per request
      url.searchParams.append('key', apiKey);
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }
  
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
  
      const data = await response.json();
  
      // Extract comments from the response
      const extractedComments = data.items.map(item => {
        const comment = item.snippet.topLevelComment.snippet;
        return comment.textDisplay.trim();
      });
  
      return {
        comments: extractedComments,
        nextPageToken: data.nextPageToken
      };
    };
  
    try {
      console.log('Fetching comments for video ID:', videoId);
  
      // Fetch the first page of comments
      let result = await fetchCommentsPage();
      comments.push(...result.comments);
      nextPageToken = result.nextPageToken;
      fetchedCommentsCount += result.comments.length;
  
      // Continue fetching if more comments are available and we haven't reached max
      while (nextPageToken && fetchedCommentsCount < maxComments) {
        result = await fetchCommentsPage(nextPageToken);
        comments.push(...result.comments);
        nextPageToken = result.nextPageToken;
        fetchedCommentsCount += result.comments.length;
      }
  
      // Return all comments as a single string, separated by commas
      return comments.slice(0, maxComments).join(', ');
    } catch (error) {
      console.error('Error fetching YouTube comments:', error);
      throw error;
    }
  }
  


async function handleContentGeneration({ prompt, choice, cc }) {
  console.log('Handling content generation:', { 
    prompt, 
    choice,
    ccLength: cc ? cc.length : 0,
    ccPreview: cc ? cc.substring(0, 100) + '...' : 'No captions'
  });

  try {
    const response = await fetch(`${endpoint}:8080/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: prompt, choice, cc })
    });

    console.log('Fetch response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Processed content data:', data);
      return data.result;
    } else {
      const errorText = await response.text();
      console.error('Error generating content:', errorText);
      throw new Error(`Error generating content: ${errorText}`);
    }
  } catch (error) {
    console.error('Catch block - Error generating content:', error);
    throw error;
  }
}

async function handleContentEnhancement({ text, contentType, userPrompt }) {
  console.log('Handling content enhancement:', { text, contentType, userPrompt });

  try {
    const response = await fetch(`${endpoint}:8080/enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, contentType, user_prompt: userPrompt })
    });

    console.log('Fetch response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Enhanced content data:', data);
      return data.result;
    } else {
      const errorText = await response.text();
      console.error('Error enhancing content:', errorText);
      throw new Error(`Error enhancing content: ${errorText}`);
    }
  } catch (error) {
    console.error('Catch block - Error enhancing content:', error);
    throw error;
  }
}

async function handleCommentsSummarization({ comments }) {
  console.log('Handling comments summarization:', { commentsCount: comments.length });
  action = "summarize"
  try {
    const response = await fetch(`${endpoint}:8080/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments, action })
    });

    console.log('Fetch response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Summarized comments data:', data);
      return data.response;
    } else {
      const errorText = await response.text();
      console.error('Error summarizing comments:', errorText);
      throw new Error(`Error summarizing comments: ${errorText}`);
    }
  } catch (error) {
    console.error('Catch block - Error summarizing comments:', error);
    throw error;
  }
}

console.log('YouTube Studio Enhancer background script loaded.');