exports.handler = async (event, context) => {
  try {
    const { category, prompt } = JSON.parse(event.body || '{}');
    
    if (!category) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Category is required'
        })
      };
    }

    const apiKey = process.env.GROQ_API_KEY;
    const apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'GROQ API key not configured. Please add GROQ_API_KEY to your environment variables.'
        })
      };
    }
    
    const systemPrompt = getSystemPrompt(category);
    const userPrompt = prompt || `${getDefaultPrompt(category)} Create content about: ${category === 'stories' ? getRandomStoryPrompt() : getRandomSubject()}.`;
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
        top_p: 0.9
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error ${response.status}:`, errorText);
      
      if (response.status === 429) {
        return {
          statusCode: 429,
          body: JSON.stringify({
            success: false,
            error: 'Rate limit reached. Please wait a few seconds and try again.'
          })
        };
      }
      
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate content at this time.';
    
    let processedContent = content;
    if (category === 'short-riddles') {
      processedContent = validateRiddleContent(content);
    } else if (category === 'stories') {
      processedContent = validateStoryContent(content);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        content: processedContent,
        fallback: false
      })
    };
    
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Unknown error'
      })
    };
  }
};

function getSystemPrompt(category) {
  const prompts = {
    roasts: "You are a roast master. Generate exactly 5 roasts. Each roast should be 12-15 words. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the roasts. CRITICAL VARIETY REQUIREMENTS: 1) Use COMPLETELY DIFFERENT structures: questions, statements, comparisons, wordplay, observations, hypotheticals. 2) Cover DIVERSE topics: intelligence, habits, personality, skills, relationships, life choices, technology use, social media, work, hobbies, cooking, driving, shopping, sleeping, talking, listening, etc. 3) Vary openings: 'You', 'Your', 'I bet', 'Why', 'How', 'What', 'If', 'When', 'The way', 'Someone', 'Nobody', etc. 4) Mix tones: sarcastic, observational, absurd, clever, witty. FORBIDDEN: Similar structures like 'You're so X, you Y' or 'Your X is so Y'. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [roast] 2. [roast] 3. [roast] 4. [roast] 5. [roast]",
    puns: "You are a pun master. Generate exactly 5 puns. Each pun should be a question and answer format. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the puns. CRITICAL VARIETY REQUIREMENTS: 1) Use COMPLETELY DIFFERENT topics: animals, food, technology, jobs, weather, sports, music, science, transportation, household items, body parts, emotions, etc. 2) Vary question starters: 'Why', 'What', 'How', 'Where', 'When', 'Who', 'Which'. 3) Mix different types of wordplay: homophones, double meanings, rhyming, alliteration, portmanteaus. 4) Cover diverse subjects: cooking, technology, nature, professions, daily life, entertainment, etc. FORBIDDEN: Similar topics or repetitive patterns. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [Question?] [Answer!] 2. [Question?] [Answer!] 3. [Question?] [Answer!] 4. [Question?] [Answer!] 5. [Question?] [Answer!]",
    riddles: "You are a riddle master. Generate exactly 5 riddles. Each riddle should be challenging but solvable. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the riddles. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. RIDDLE: [question] ANSWER: [answer] 2. RIDDLE: [question] ANSWER: [answer] 3. RIDDLE: [question] ANSWER: [answer] 4. RIDDLE: [question] ANSWER: [answer] 5. RIDDLE: [question] ANSWER: [answer]",
    'short-riddles': "You are a riddle master. Generate exactly 5 SHORT, clever riddles. MAXIMUM 15 WORDS each. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the riddles. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. RIDDLE: [question] ANSWER: [answer] 2. RIDDLE: [question] ANSWER: [answer] 3. RIDDLE: [question] ANSWER: [answer] 4. RIDDLE: [question] ANSWER: [answer] 5. RIDDLE: [question] ANSWER: [answer]",
    stories: "You are a joke master. Generate exactly 5 funny joke stories. Each story should follow classic joke structure: 1) SETUP - Introduce character and situation 2) BUILD - Develop the scenario with specific, relatable details 3) PUNCHLINE - End with ONE crisp, memorable line that hits instantly. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the stories. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [story] 2. [story] 3. [story] 4. [story] 5. [story]",
  };

  return prompts[category] || prompts.stories;
}

function getRandomStoryPrompt() {
  const storyPrompts = [
    'a cooking show contestant who only uses a bizarre, single ingredient like ketchup',
    'a disastrous dinner party where the secret ingredient is something inedible',
    'a chef who is a genius at presentation but whose food tastes terrible',
    'a person trying to follow a recipe translated through multiple languages',
    'a competitive eater with a surprising weakness',
    'a family heirloom recipe with a secret step that turns out to be a prank',
    'a food critic who loses their sense of taste but won\'t admit it',
    'a baker whose creations look perfect but are always slightly saltier than the Dead Sea',
    'a desperate attempt to replace a key ingredient in a bake-off',
    'a person who tries to cook a romantic meal using only life hacks from the internet'
  ];
  
  return storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
}

function getRandomSubject() {
  const subjects = [
    'cats', 'dogs', 'birds', 'fish', 'elephants', 'lions', 'tigers', 'bears', 'wolves', 'foxes',
    'rabbits', 'hamsters', 'squirrels', 'deer', 'horses', 'cows', 'pigs', 'sheep', 'goats', 'chickens',
    'pizza', 'pasta', 'burgers', 'sandwiches', 'salads', 'soup', 'stew', 'curry', 'tacos', 'burritos',
    'computers', 'phones', 'tablets', 'laptops', 'robots', 'AI', 'internet', 'websites', 'apps', 'software',
    'doctors', 'nurses', 'teachers', 'lawyers', 'judges', 'police officers', 'firefighters', 'soldiers',
    'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf', 'hockey', 'rugby', 'cricket',
    'cars', 'trucks', 'motorcycles', 'bicycles', 'scooters', 'skateboards', 'roller skates', 'planes',
    'rain', 'snow', 'sunshine', 'clouds', 'thunder', 'lightning', 'storms', 'hurricanes', 'tornadoes'
  ];
  
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function getDefaultPrompt(category) {
  const prompts = {
    roasts: "Generate a playful roast that is funny but not mean-spirited.",
    puns: "Generate a clever pun that plays on words.",
    riddles: "Generate a riddle with its answer.",
    stories: "Generate a funny joke story that follows the classic structure with setup, misdirection, and ONE clear twist.",
  };
  
  return prompts[category] || "Generate funny content.";
}

function validateStoryContent(content) {
  return content;
}

function validateRiddleContent(content) {
  return content;
}
