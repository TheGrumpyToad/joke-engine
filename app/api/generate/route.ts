import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { category, prompt } = await request.json()
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required'
      }, { status: 400 })
    }

    
    const apiKey = process.env.GROQ_API_KEY
    const apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions'
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
    
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      // Return error when API key is not configured
      return NextResponse.json({
        success: false,
        error: 'GROQ API key not configured. Please add GROQ_API_KEY to your environment variables.'
      }, { status: 500 })
    }
    
    const systemPrompt = getSystemPrompt(category)
    const userPrompt = prompt || `${getDefaultPrompt(category)} Create content about: ${category === 'stories' ? getRandomStoryPrompt() : getRandomSubject()}.`
    
    // Prepare messages array
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ]
    
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
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Groq API error ${response.status}:`, errorText)
      
      // Handle rate limit specifically
      if (response.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'Rate limit reached. Please wait a few seconds and try again.'
        }, { status: 429 })
      }
      
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate content at this time.'
    
    // Validate and process content based on category
    let processedContent = content
    if (category === 'short-riddles') {
      processedContent = validateRiddleContent(content)
    } else if (category === 'stories') {
      processedContent = validateStoryContent(content)
    }
    
    console.log('=== ROAST DEBUG ===')
    console.log('Category:', category)
    console.log('Original content length:', content.length)
    console.log('Original first line:', content.split('\n')[0])
    console.log('Original first line word count:', content.split('\n')[0].split(' ').length)
    
    console.log('Processed content length:', processedContent.length)
    console.log('Processed first line:', processedContent.split('\n')[0])
    console.log('Processed first line word count:', processedContent.split('\n')[0].split(' ').length)
    console.log('==================')
    
    return NextResponse.json({
      success: true,
      content: processedContent,
      fallback: false
    })
    
  } catch (error) {
    console.error('API Error:', error)
    
    // Return error response
    try {
      const body = await request.json()
      const { category } = body
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    } catch (parseError) {
      // If we can't parse the request, return a generic error
      return NextResponse.json({
        success: false,
        error: 'Request parsing failed'
      }, { status: 400 })
    }
  }
}

function getSystemPrompt(category: string): string {
  const prompts = {
        roasts: "You are a roast master. Generate exactly 5 roasts. Each roast should be 12-15 words. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the roasts. CRITICAL VARIETY REQUIREMENTS: 1) Use COMPLETELY DIFFERENT structures: questions, statements, comparisons, wordplay, observations, hypotheticals. 2) Cover DIVERSE topics: intelligence, habits, personality, skills, relationships, life choices, technology use, social media, work, hobbies, cooking, driving, shopping, sleeping, talking, listening, etc. 3) Vary openings: 'You', 'Your', 'I bet', 'Why', 'How', 'What', 'If', 'When', 'The way', 'Someone', 'Nobody', etc. 4) Mix tones: sarcastic, observational, absurd, clever, witty. FORBIDDEN: Similar structures like 'You're so X, you Y' or 'Your X is so Y'. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [roast] 2. [roast] 3. [roast] 4. [roast] 5. [roast]",
    puns: "You are a pun master. Generate exactly 5 puns. Each pun should be a question and answer format. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the puns. CRITICAL VARIETY REQUIREMENTS: 1) Use COMPLETELY DIFFERENT topics: animals, food, technology, jobs, weather, sports, music, science, transportation, household items, body parts, emotions, etc. 2) Vary question starters: 'Why', 'What', 'How', 'Where', 'When', 'Who', 'Which'. 3) Mix different types of wordplay: homophones, double meanings, rhyming, alliteration, portmanteaus. 4) Cover diverse subjects: cooking, technology, nature, professions, daily life, entertainment, etc. FORBIDDEN: Similar topics or repetitive patterns. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [Question?] [Answer!] 2. [Question?] [Answer!] 3. [Question?] [Answer!] 4. [Question?] [Answer!] 5. [Question?] [Answer!]",
    riddles: "You are a riddle master. Generate exactly 5 riddles. Each riddle should be challenging but solvable. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the riddles. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. RIDDLE: [question] ANSWER: [answer] 2. RIDDLE: [question] ANSWER: [answer] 3. RIDDLE: [question] ANSWER: [answer] 4. RIDDLE: [question] ANSWER: [answer] 5. RIDDLE: [question] ANSWER: [answer]",
    'short-riddles': "You are a riddle master. Generate exactly 5 SHORT, clever riddles. MAXIMUM 15 WORDS each. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the riddles. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. RIDDLE: [question] ANSWER: [answer] 2. RIDDLE: [question] ANSWER: [answer] 3. RIDDLE: [question] ANSWER: [answer] 4. RIDDLE: [question] ANSWER: [answer] 5. RIDDLE: [question] ANSWER: [answer]",
    stories: "You are a joke master. Generate exactly 5 funny joke stories. Each story should follow classic joke structure: 1) SETUP - Introduce character and situation 2) BUILD - Develop the scenario with specific, relatable details 3) PUNCHLINE - End with ONE crisp, memorable line that hits instantly. NO DISCLAIMERS. NO EXPLANATIONS. NO WARNINGS. NO INTRODUCTIONS. Start immediately with the stories. FORBIDDEN: Any disclaimers, warnings, or explanations. FORBIDDEN: Starting with 'I can generate' or 'Here's a' or 'Let me' or any introductory text. Start directly with: 1. [story] 2. [story] 3. [story] 4. [story] 5. [story]",
  }

  return prompts[category as keyof typeof prompts] || prompts.stories
}

function getRandomStoryPrompt(): string {
  const storyPrompts = [
    // Food & Cooking
    'a cooking show contestant who only uses a bizarre, single ingredient like ketchup',
    'a disastrous dinner party where the secret ingredient is something inedible',
    'a chef who is a genius at presentation but whose food tastes terrible',
    'a person trying to follow a recipe translated through multiple languages',
    'a competitive eater with a surprising weakness',
    'a family heirloom recipe with a secret step that turns out to be a prank',
    'a food critic who loses their sense of taste but won\'t admit it',
    'a baker whose creations look perfect but are always slightly saltier than the Dead Sea',
    'a desperate attempt to replace a key ingredient in a bake-off',
    'a person who tries to cook a romantic meal using only life hacks from the internet',
    
    // Home & DIY Disasters
    'a homeowner who attempts a simple repair after watching one YouTube video',
    'a smart house that becomes sentient and deeply passive-aggressive',
    'a couple building flat-pack furniture without the instructions',
    'a neighbor who gives overly confident but catastrophically bad DIY advice',
    'a prized lawn that is accidentally replaced with a look-alike weed',
    'a dog who is a secret master of home demolition',
    'a quick paint job that reveals a hidden, embarrassing wall mural from the 70s',
    'a garage sale where someone sells an item without knowing its immense value',
    'a person trying to soundproof a room with wholly inappropriate materials',
    'a garden gnome that keeps moving on its own, leading to a paranoid homeowner',
    
    // Technology & Modern Life
    'an auto-correct message that sends a devastatingly wrong text to the wrong person',
    'a person trying to explain a simple tech problem to a grandparent over the phone',
    'a social media influencer whose perfect life is exposed by a background detail in a post',
    'a video game character who becomes self-aware and complains about the player\'s bad choices',
    'a mandatory software update that gives a computer a sassy personality',
    'a person who falls for an obvious online scam and accidentally outsmarts the scammers',
    'a GPS that navigates based on the driver\'s worst personality traits',
    'a smart fridge that orders food based on passive-aggressive notes left by a spouse',
    'a Zoom call where a participant doesn\'t realize their filter is horrifyingly inappropriate',
    'a password so secure the owner can never remember it themselves',
    
    // Jobs & The Workplace
    'an employee who pretends to be busy by mastering the sound of furious typing',
    'a team-building exercise that accidentally reveals deep-seated rivalries',
    'an intern tasked with getting coffee who gets everything hilariously wrong',
    'a worker who blames all their mistakes on a fictional coworker',
    'a boss who tries to use youthful slang to connect with employees',
    'a company memo written in such confusing corporate jargon that no one understands it',
    'a person who accidentally hits Reply All on a scathing email',
    'an office kleptomaniac who only steals leftovers from the breakroom fridge',
    'a consultant who uses a Magic 8-Ball to make major decisions',
    'a mandatory sensitivity training that is led by the office\'s most insensitive person',
    
    // Animals & Pets
    'a cat who is a diabolical mastermind trying to get its owner evicted',
    'a dog who is a terrible guard dog but an excellent gossip',
    'a parrot that learns to perfectly mimic the sound of the doorbell to torment the dog',
    'a person who tries to teach their goldfish a complex trick',
    'a pet sitter who is convinced the hamster is judging them',
    'a squirrel that wages a strategic war on a bird feeder',
    'a dog walker who gets tangled up by a pack of small, but determined, dogs',
    'a psychic pet communicator who is clearly just making things up',
    'a pet who is secretly better at a human job than its owner',
    'a person who dresses their very patient, very embarrassed pet in elaborate costumes',

    
    // Holidays & Special Occasions
    'a family\'s Thanksgiving dinner ruined by a well-meaning relative\'s creative side dish',
    'a Secret Santa gift that is so terrible it becomes legendary',
    'a Halloween costume that is too effective and causes genuine panic',
    'a New Year\'s resolution that is broken by 9:00 AM on January 1st',
    'a holiday letter that exaggerates a family\'s year to an absurd degree',
    'a Valentine\'s Day plan that goes perfectly, but for the wrong person',
    'a Fourth of July fireworks show that is a spectacular dud',
    'an April Fool\'s prank that the target takes with unsettling seriousness',
    'a holiday family photo session that descends into chaos',
    'a birthday party where the clowns go on strike',
    
    // School & Education
    'a student who writes an entire essay based on the Wikipedia summary of a book',
    'a school project built by an over-involved parent',
    'a substitute teacher who is clearly an imposter',
    'a student who accidentally corrects the teacher on a very personal, very wrong fact',
    'a science fair project that works a little too well',
    'a teacher who uses pop culture to explain history, with mixed results',
    'a parent-teacher conference that reveals more about the parent than the child',
    'a school play where the lead actor forgets they are the lead actor',
    'a cafeteria lunch lady who is a former gourmet chef with a dark past',
    'a student who tries to use the dog ate my homework in the digital age',
    
    // Travel & Transportation
    'a family road trip where the kids navigate using an old, torn paper map',
    'an airline passenger in the middle seat who has a bizarre secret',
    'a tourist who gets lost but is too proud to ask for directions',
    'a taxi driver who gives a historical tour that is 90% fabricated',
    'a language barrier misunderstanding that leads to someone accidentally buying a farm animal',
    'a relaxing vacation that is more stressful than work',
    'a cruise ship passenger who packs for every possible contingency',
    'a person who tries to smuggle a questionable souvenir through customs',
    'a GPS that leads a driver to a location that doesn\'t technically exist',
    'a traveler who tries to blend in with the locals but fails spectacularly',
    
    // Relationships & Dating
    'a blind date where both people were misled about who the other was',
    'a couple trying to assemble a piece of furniture together as a relationship test',
    'a person who tries to use pickup lines from a movie on a very unimpressed target',
    'a wedding speech that reveals a little too much information',
    'a dating profile that uses a heavily photoshopped picture from 20 years ago',
    'a partner who is terrible at giving gifts but thinks they are amazing at it',
    'a double date where one couple is clearly on the verge of breaking up',
    'a person who brings their mother on a first date',
    'a romantic gesture that is misinterpreted as a threat',
    'a couple who argues over the correct way to pronounce a word for their entire marriage',
    
    // Hobbies & Leisure
    'a book club that never actually reads the books',
    'a fisherman whose big one that got away story changes every time',
    'a gardener who is at war with a specific, resilient weed',
    'a karaoke singer who believes they are a prodigy but is tone-deaf',
    'a movie buff who constantly points out tiny, irrelevant plot holes',
    'a gamer who takes a children\'s board game way too seriously',
    'a knitter whose projects always turn out slightly alive',
    'a jogger who is consistently passed by an elderly power-walker',
    'a birdwatcher who mistakes common birds for exotic, extinct species',
    'a person who takes up meditation to reduce stress but becomes competitively zen'
  ]
  
  return storyPrompts[Math.floor(Math.random() * storyPrompts.length)]
}

function getRandomSubject(): string {
  const subjects = [
    // Animals & Nature
    'cats', 'dogs', 'birds', 'fish', 'elephants', 'lions', 'tigers', 'bears', 'wolves', 'foxes',
    'rabbits', 'hamsters', 'squirrels', 'deer', 'horses', 'cows', 'pigs', 'sheep', 'goats', 'chickens',
    'ducks', 'geese', 'penguins', 'dolphins', 'whales', 'sharks', 'octopuses', 'jellyfish', 'butterflies',
    'bees', 'spiders', 'snakes', 'lizards', 'frogs', 'turtles', 'crocodiles', 'alligators', 'zebras',
    'giraffes', 'monkeys', 'gorillas', 'chimpanzees', 'pandas', 'koalas', 'kangaroos', 'sloths', 'hedgehogs',
    'raccoons', 'skunks', 'beavers', 'otters', 'seals', 'walruses', 'polar bears', 'grizzly bears',
    
    // Food & Cooking
    'pizza', 'pasta', 'burgers', 'sandwiches', 'salads', 'soup', 'stew', 'curry', 'tacos', 'burritos',
    'sushi', 'ramen', 'noodles', 'rice', 'bread', 'cake', 'cookies', 'pie', 'donuts', 'muffins',
    'pancakes', 'waffles', 'cereal', 'eggs', 'bacon', 'sausage', 'cheese', 'milk', 'yogurt', 'ice cream',
    'chocolate', 'candy', 'fruit', 'vegetables', 'potatoes', 'tomatoes', 'onions', 'garlic', 'carrots',
    'broccoli', 'spinach', 'lettuce', 'cucumber', 'peppers', 'mushrooms', 'corn', 'beans', 'peas',
    'apples', 'bananas', 'oranges', 'grapes', 'strawberries', 'blueberries', 'pineapple', 'watermelon',
    'coffee', 'tea', 'juice', 'soda', 'beer', 'wine', 'cocktails', 'smoothies', 'milkshakes',
    
    // Technology & Science
    'computers', 'phones', 'tablets', 'laptops', 'robots', 'AI', 'internet', 'websites', 'apps', 'software',
    'programming', 'coding', 'hacking', 'cybersecurity', 'data', 'algorithms', 'machine learning', 'virtual reality',
    'augmented reality', 'drones', 'satellites', 'space', 'rockets', 'astronauts', 'planets', 'stars', 'galaxies',
    'chemistry', 'physics', 'biology', 'mathematics', 'engineering', 'medicine', 'surgery', 'vaccines',
    'DNA', 'genes', 'evolution', 'atoms', 'molecules', 'electricity', 'magnets', 'gravity', 'light',
    'sound', 'waves', 'energy', 'solar power', 'wind power', 'nuclear power', 'batteries', 'circuits',
    
    // Professions & Work
    'doctors', 'nurses', 'teachers', 'lawyers', 'judges', 'police officers', 'firefighters', 'soldiers',
    'pilots', 'chefs', 'waiters', 'cashiers', 'salespeople', 'managers', 'CEOs', 'engineers', 'architects',
    'artists', 'musicians', 'singers', 'actors', 'directors', 'writers', 'journalists', 'photographers',
    'designers', 'programmers', 'scientists', 'researchers', 'dentists', 'veterinarians',
    'farmers', 'construction workers', 'mechanics', 'electricians', 'plumbers', 'carpenters', 'painters',
    'gardeners', 'landscapers', 'cleaners', 'security guards', 'delivery drivers', 'truck drivers',
    'bus drivers', 'taxi drivers', 'flight attendants', 'hotel staff', 'receptionists', 'secretaries',
    
    // Sports & Activities
    'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf', 'hockey', 'rugby', 'cricket',
    'swimming', 'running', 'cycling', 'skiing', 'snowboarding', 'skating', 'surfing', 'diving',
    'boxing', 'wrestling', 'martial arts', 'gymnastics', 'dancing', 'yoga', 'pilates', 'weightlifting',
    'hiking', 'camping', 'fishing', 'hunting', 'archery', 'shooting', 'bowling', 'pool', 'darts',
    'chess', 'checkers', 'poker', 'blackjack', 'video games', 'board games', 'card games', 'puzzles',
    'reading', 'writing', 'painting', 'drawing', 'sculpting', 'photography', 'gardening', 'cooking',
    'baking', 'sewing', 'knitting', 'crocheting', 'woodworking', 'metalworking', 'pottery', 'jewelry',
    
    // Transportation & Travel
    'cars', 'trucks', 'motorcycles', 'bicycles', 'scooters', 'skateboards', 'roller skates', 'planes',
    'helicopters', 'trains', 'subways', 'buses', 'boats', 'ships', 'yachts', 'cruise ships', 'submarines',
    'rockets', 'space shuttles', 'hot air balloons', 'parachutes', 'hang gliders', 'kites', 'sleds',
    'snowmobiles', 'ATVs', 'tanks', 'bulldozers', 'cranes', 'tractors', 'ambulances', 'fire trucks',
    'police cars', 'taxi cabs', 'limousines', 'convertibles', 'SUVs', 'vans', 'pickup trucks', 'semi trucks',
    'motor homes', 'campers', 'trailers', 'wagons', 'carts', 'wheelbarrows', 'strollers', 'wheelchairs',
    
    // Weather & Seasons
    'rain', 'snow', 'sunshine', 'clouds', 'thunder', 'lightning', 'storms', 'hurricanes', 'tornadoes',
    'blizzards', 'heat waves', 'cold snaps', 'fog', 'mist', 'dew', 'frost', 'ice', 'hail', 'sleet',
    'spring', 'summer', 'fall', 'winter', 'morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk',
    'sunrise', 'sunset', 'moon', 'stars', 'constellations', 'meteors', 'comets', 'eclipses', 'aurora',
    'tides', 'waves', 'currents', 'wind', 'breeze', 'gusts', 'cyclones', 'anticyclones', 'pressure',
    'humidity', 'temperature', 'thermometer', 'barometer', 'anemometer', 'hygrometer', 'weather vane',
    
    // Body Parts & Health
    'eyes', 'ears', 'nose', 'mouth', 'teeth', 'tongue', 'lips', 'cheeks', 'chin', 'forehead',
    'hair', 'eyebrows', 'eyelashes', 'beard', 'mustache', 'sideburns', 'head', 'neck', 'shoulders',
    'arms', 'hands', 'fingers', 'thumbs', 'nails', 'wrists', 'elbows', 'chest', 'back', 'spine',
    'ribs', 'lungs', 'heart', 'stomach', 'liver', 'kidneys', 'intestines', 'brain', 'nerves', 'muscles',
    'bones', 'joints', 'knees', 'legs', 'feet', 'toes', 'ankles', 'calves', 'thighs', 'hips',
    'blood', 'veins', 'arteries', 'cells', 'tissues', 'organs', 'glands', 'hormones', 'vitamins',
    
    // Emotions & Personality
    'happiness', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'love', 'hate', 'jealousy', 'envy',
    'pride', 'shame', 'guilt', 'regret', 'hope', 'despair', 'anxiety', 'worry', 'stress', 'relief',
    'excitement', 'boredom', 'curiosity', 'confusion', 'clarity', 'understanding', 'wisdom', 'ignorance',
    'patience', 'impatience', 'kindness', 'cruelty', 'generosity', 'greed', 'honesty', 'dishonesty',
    'bravery', 'cowardice', 'confidence', 'insecurity', 'optimism', 'pessimism', 'enthusiasm', 'apathy',
    'compassion', 'empathy', 'sympathy', 'indifference', 'gratitude', 'ingratitude', 'forgiveness', 'resentment',
    'loyalty', 'betrayal', 'trust', 'suspicion', 'faith', 'doubt', 'belief', 'skepticism', 'certainty', 'uncertainty',
    
    // Household Items
    'chairs', 'tables', 'beds', 'sofas', 'couches', 'desks', 'dressers', 'wardrobes', 'closets', 'shelves',
    'lamps', 'lights', 'candles', 'mirrors', 'pictures', 'frames', 'clocks', 'watches', 'alarms', 'radios',
    'televisions', 'computers', 'phones', 'cameras', 'books', 'magazines', 'newspapers', 'pens', 'pencils',
    'paper', 'notebooks', 'calendars', 'planners', 'keys', 'locks', 'doors', 'windows', 'curtains', 'blinds',
    'carpets', 'rugs', 'blankets', 'pillows', 'towels', 'sheets', 'clothes', 'shoes', 'hats', 'gloves',
    'jewelry', 'accessories', 'bags', 'purses', 'wallets', 'belts', 'ties', 'scarves', 'sunglasses',
    'kitchen utensils', 'pots', 'pans', 'plates', 'bowls', 'cups', 'glasses', 'forks', 'knives', 'spoons',
    'refrigerators', 'ovens', 'stoves', 'microwaves', 'dishwashers', 'washing machines', 'dryers', 'vacuum cleaners',
    
    // Entertainment & Media
    'movies', 'films', 'cinema', 'theater', 'plays', 'musicals', 'concerts', 'shows', 'performances',
    'music', 'songs', 'lyrics', 'melodies', 'rhythms', 'instruments', 'pianos', 'guitars', 'drums', 'violins',
    'trumpets', 'saxophones', 'flutes', 'clarinets', 'trombones', 'tubas', 'harps', 'organs', 'keyboards',
    'books', 'novels', 'stories', 'poems', 'essays', 'articles', 'blogs', 'magazines', 'comics', 'manga',
    'television', 'TV shows', 'series', 'episodes', 'seasons', 'channels', 'networks', 'streaming', 'podcasts',
    'radio', 'stations', 'programs', 'interviews', 'talk shows', 'news', 'weather', 'sports', 'comedy',
    'drama', 'action', 'romance', 'horror', 'thriller', 'mystery', 'sci-fi', 'fantasy', 'adventure', 'documentary',
    
    // Nature & Environment
    'trees', 'forests', 'mountains', 'hills', 'valleys', 'rivers', 'lakes', 'oceans', 'seas', 'beaches',
    'deserts', 'canyons', 'caves', 'volcanoes', 'geysers', 'waterfalls', 'streams', 'ponds', 'swamps',
    'grasslands', 'prairies', 'tundras', 'ice caps', 'glaciers', 'rocks', 'stones', 'pebbles', 'sand',
    'soil', 'dirt', 'mud', 'clay', 'minerals', 'crystals', 'gems', 'diamonds', 'gold', 'silver',
    'copper', 'iron', 'steel', 'aluminum', 'plastic', 'glass', 'wood', 'leather', 'fabric', 'cotton',
    'wool', 'silk', 'linen', 'nylon', 'polyester', 'rubber', 'paper', 'cardboard', 'metal', 'ceramic',
    
    // Time & Calendar
    'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years', 'decades', 'centuries', 'millennia',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'weekdays', 'weekends',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December', 'spring', 'summer', 'fall', 'winter', 'holidays', 'birthdays', 'anniversaries',
    'vacations', 'weekends', 'workdays', 'school days', 'sick days', 'personal days', 'deadlines', 'schedules',
    'appointments', 'meetings', 'events', 'parties', 'celebrations', 'festivals', 'ceremonies', 'graduations',
    'weddings', 'funerals', 'births', 'deaths', 'retirements', 'promotions', 'awards', 'achievements', 'milestones',
    
    // Colors & Shapes
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'grey',
    'silver', 'gold', 'bronze', 'copper', 'maroon', 'navy', 'teal', 'turquoise', 'lime', 'magenta', 'cyan',
    'beige', 'tan', 'cream', 'ivory', 'pearl', 'coral', 'salmon', 'lavender', 'violet', 'indigo', 'crimson',
    'scarlet', 'burgundy', 'emerald', 'jade', 'olive', 'forest green', 'sky blue', 'royal blue', 'midnight blue',
    'circles', 'squares', 'triangles', 'rectangles', 'ovals', 'diamonds', 'hearts', 'stars', 'crescents',
    'spirals', 'zigzags', 'waves', 'lines', 'curves', 'angles', 'corners', 'edges', 'sides', 'surfaces',
    
    // Numbers & Math
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty',
    'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million', 'billion',
    'trillion', 'zero', 'infinity', 'addition', 'subtraction', 'multiplication', 'division', 'fractions',
    'decimals', 'percentages', 'ratios', 'proportions', 'equations', 'formulas', 'calculations', 'statistics',
    'probability', 'geometry', 'algebra', 'trigonometry', 'calculus', 'mathematics', 'arithmetic', 'counting',
    
    // Random Objects
    'balloons', 'bubbles', 'toys', 'games', 'puzzles', 'blocks', 'dolls', 'action figures', 'stuffed animals',
    'kites', 'yo-yos', 'marbles', 'jacks', 'dominoes', 'cards', 'dice', 'spinners', 'tops', 'frisbees',
    'hula hoops', 'jump ropes', 'skipping ropes', 'balls', 'bats', 'rackets', 'clubs', 'sticks', 'ropes',
    'chains', 'wires', 'cables', 'tubes', 'pipes', 'hoses', 'valves', 'switches', 'buttons',
    'levers', 'handles', 'knobs', 'dials', 'gauges', 'meters', 'scales', 'rulers', 'tape measures', 'compasses'
  ]
  
  return subjects[Math.floor(Math.random() * subjects.length)]
}

function getDefaultPrompt(category: string): string {
  const prompts = {
    roasts: "Generate a playful roast that is funny but not mean-spirited.",
    puns: "Generate a clever pun that plays on words.",
    riddles: "Generate a riddle with its answer.",
    stories: "Generate a funny joke story that follows the classic structure with setup, misdirection, and ONE clear twist.",
  }
  
  return prompts[category as keyof typeof prompts] || "Generate funny content."
}

function truncateRoasts(content: string): string {
  console.log('=== TRUNCATE FUNCTION CALLED ===')
  console.log('Input content:', content.substring(0, 100) + '...')
  
  const lines = content.split('\n')
  const processedLines = lines.map(line => {
    if (line.match(/^\d+\./)) {
      const words = line.split(' ')
      if (words.length > 10) {
        // Only truncate if longer than 10 words
        return words.slice(0, 10).join(' ') + '.'
      }
    }
    return line
  })
  
  const result = processedLines.join('\n')
  console.log('Returning processed content:', result)
  console.log('=== END TRUNCATE FUNCTION ===')
  
  return result
}

function validateStoryContent(content: string): string {
  // Check for proper story structure and quality
  const validationIssues = []
  
  // Check for minimum length (stories should be 4-6 sentences)
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  if (sentenceCount < 4) {
    validationIssues.push("Story too short - needs at least 4 sentences")
  }
  if (sentenceCount > 6) {
    validationIssues.push("Story too long - maximum 6 sentences allowed")
  }
  
  // Check for maximum length (stories should be concise and captivating)
  if (content.length > 1500) {
    validationIssues.push("Story too long - needs to be more concise")
  }
  
  // CRITICAL: Check for forbidden elements
  const hasPuns = /fowl play|purr-fect|bringing the heat|checked out|noise complaints|better brush with the law/i.test(content)
  if (hasPuns) {
    validationIssues.push("Contains forbidden puns or wordplay")
  }
  
  // Check for multiple punchlines (sentences that end with quotes or weak endings)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const weakEndings = sentences.filter(s => 
    /I guess|That's what they mean|you're going to need|simply said|dryly remarked|final words/i.test(s)
  ).length
  if (weakEndings > 1) {
    validationIssues.push("Multiple weak punchlines detected")
  }
  
  // Check for illogical cultural references
  const hasIllogicalReferences = /hercules|hydra|robert the bruce|spider/i.test(content) && 
    !/george washington|cherry tree|prodigal son|good samaritan/i.test(content)
  if (hasIllogicalReferences) {
    validationIssues.push("Contains illogical cultural references")
  }
  
  // Check for story structure elements
  const hasSetup = /once|there was|a man|a woman|young|old|farmer|student|worker|named|lived|town|city/i.test(content)
  const hasConflict = /problem|embarrassed|worried|angry|upset|trouble|issue|desperate|frustrated|determined/i.test(content)
  const hasAction = /pushed|threw|cut|broke|moved|ran|jumped|decided|took|grabbed|built|challenged/i.test(content)
  const hasMisdirection = /remember|like|just like|similar|story|parable|moral|lesson|good samaritan|george washington|prodigal son/i.test(content)
  const hasTwist = /but|however|actually|turns out|revealed|discovered|found out|problem|not a cow|wasn't in/i.test(content)
  
  // Only require 3 out of 5 elements to pass
  const structureScore = [hasSetup, hasConflict, hasAction, hasMisdirection, hasTwist].filter(Boolean).length
  if (structureScore < 3) {
    validationIssues.push(`Missing story structure - only ${structureScore}/5 elements present`)
  }
  
  // Check for quality indicators
  const qualityScore = calculateStoryQuality(content)
  if (qualityScore < 4) {
    validationIssues.push(`Low quality score: ${qualityScore}/10`)
  }
  
  // If validation fails, return original content
  if (validationIssues.length > 0) {
    console.log('Story validation failed:', validationIssues.join(', '))
    return content
  }
  
  console.log(`Story passed validation with quality score: ${qualityScore}/10`)
  return content
}

function calculateStoryQuality(content: string): number {
  let score = 0
  
  // Logical consistency (2 points)
  if (hasStoryLogicalConsistency(content)) score += 2
  
  // Clear misdirection (2 points)
  if (hasClearMisdirection(content)) score += 2
  
  // Satisfying twist (2 points)
  if (hasSatisfyingTwist(content)) score += 2
  
  // Proper pacing (2 points)
  if (hasProperPacing(content)) score += 2
  
  // Engaging characters (1 point)
  if (hasEngagingCharacters(content)) score += 1
  
  // Economical storytelling (1 point)
  if (hasEconomicalStorytelling(content)) score += 1
  
  return score
}

function hasStoryLogicalConsistency(content: string): boolean {
  // Check for logical flow and consistency
  const logicalIndicators = [
    'because', 'so', 'therefore', 'as a result', 'consequently',
    'first', 'then', 'next', 'finally', 'meanwhile'
  ]
  
  return logicalIndicators.some(indicator => content.toLowerCase().includes(indicator))
}

function hasClearMisdirection(content: string): boolean {
  // Check for familiar cultural references
  const misdirectionIndicators = [
    'george washington', 'cherry tree', 'honesty', 'moral', 'lesson',
    'parable', 'story', 'remember', 'just like', 'similar to'
  ]
  
  return misdirectionIndicators.some(indicator => content.toLowerCase().includes(indicator))
}

function hasSatisfyingTwist(content: string): boolean {
  // Check for twist indicators
  const twistIndicators = [
    'but', 'however', 'actually', 'turns out', 'revealed',
    'discovered', 'found out', 'unexpected', 'surprise'
  ]
  
  return twistIndicators.some(indicator => content.toLowerCase().includes(indicator))
}

function hasProperPacing(content: string): boolean {
  // Check for proper paragraph structure and pacing (should be 1 paragraph)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
  return paragraphs.length === 1
}

function hasEngagingCharacters(content: string): boolean {
  // Check for character development
  const characterIndicators = [
    'young', 'old', 'farmer', 'student', 'worker', 'man', 'woman',
    'son', 'daughter', 'father', 'mother', 'husband', 'wife'
  ]
  
  return characterIndicators.some(indicator => content.toLowerCase().includes(indicator))
}

function hasEconomicalStorytelling(content: string): boolean {
  // Check for concise, focused storytelling (captivating but not too long)
  const wordCount = content.split(/\s+/).length
  return wordCount >= 30 && wordCount <= 300
}


function validateRiddleContent(content: string): string {
  // Check if content follows proper riddle format
  const riddleMatch = content.match(/RIDDLE:\s*(.+?)\s*ANSWER:\s*(.+)/i)
  if (!riddleMatch) {
    console.log('Invalid riddle format, returning original content')
    return content
  }
  
  const [, question, answer] = riddleMatch
  const cleanQuestion = question.trim()
  const cleanAnswer = answer.trim()
  
  // Comprehensive validation checks
  const validationIssues = []
  
  // Check for logical consistency issues
  const logicalErrors = [
    { pattern: /shoe/i, issue: "Shoes don't HAVE feet, they contain feet" },
    { pattern: /needle.*thread/i, issue: "Needles don't HAVE threads, thread goes through needles" },
    { pattern: /hair.*brush.*up/i, issue: "Hair DOES come down after brushing" },
    { pattern: /checkered.*plate/i, issue: "Unclear connection between checkered and 'never blocks'" },
    { pattern: /chair.*sit/i, issue: "Chairs CAN sit (people sit on chairs)" },
    { pattern: /ice.*held/i, issue: "Ice CAN be held" },
    { pattern: /teacher.*learn/i, issue: "Teachers CAN learn" },
    { pattern: /desk.*room/i, issue: "Desks HAVE room for things - contradicts 'no room'" },
    { pattern: /clock.*helps/i, issue: "Clocks don't 'help' - they tell time (vague/imprecise)" }
  ]
  
  // Check for weak wordplay or unclear connections
  const weakPatterns = [
    { pattern: /corn.*pop/i, issue: "Uses word from answer (corn → popcorn)" },
    { pattern: /pig.*bank/i, issue: "Uses word from answer (pig → piggy bank)" },
    { pattern: /bear.*cub/i, issue: "Not a riddle, just a definition" },
    { pattern: /fruit.*pit/i, issue: "Not a riddle, just a definition" }
  ]
  
  // Check for contradictions
  const contradictionPatterns = [
    { pattern: /never.*always/i, issue: "Contradictory statements" },
    { pattern: /can.*can't/i, issue: "Conflicting abilities" }
  ]
  
  // Check for vague/imprecise language
  const vaguePatterns = [
    { pattern: /\bhelps\b/i, issue: "Vague/imprecise - be more specific about function" },
    { pattern: /\buseful\b/i, issue: "Vague/imprecise - be more specific about function" },
    { pattern: /\bgood\b/i, issue: "Vague/imprecise - be more specific about quality" },
    { pattern: /\bnice\b/i, issue: "Vague/imprecise - be more specific about quality" }
  ]
  
  // Run all validation checks
  for (const { pattern, issue } of [...logicalErrors, ...weakPatterns, ...contradictionPatterns, ...vaguePatterns]) {
    if (pattern.test(cleanAnswer) || pattern.test(cleanQuestion)) {
      validationIssues.push(issue)
    }
  }
  
  // Check for proper riddle structure
  if (cleanQuestion.length < 10 || cleanQuestion.length > 100) {
    validationIssues.push("Question length inappropriate")
  }
  
  if (cleanAnswer.length < 2 || cleanAnswer.length > 50) {
    validationIssues.push("Answer length inappropriate")
  }
  
  // Check for quality indicators
  const qualityScore = calculateRiddleQuality(cleanQuestion, cleanAnswer)
  if (qualityScore < 7) {
    validationIssues.push(`Low quality score: ${qualityScore}/10`)
  }
  
  // If validation fails, return original content
  if (validationIssues.length > 0) {
    console.log('Riddle validation failed:', validationIssues.join(', '))
    return content
  }
  
  console.log(`Riddle passed validation with quality score: ${qualityScore}/10`)
  return content
}

function calculateRiddleQuality(question: string, answer: string): number {
  let score = 0
  
  // Logical consistency (3 points)
  if (hasLogicalConsistency(question, answer)) score += 3
  
  // Clear wordplay/misdirection (2 points)
  if (hasGoodWordplay(question, answer)) score += 2
  
  // Satisfying solution path (2 points)
  if (hasClearSolutionPath(question, answer)) score += 2
  
  // Proper scope (2 points)
  if (hasProperScope(question, answer)) score += 2
  
  // Engaging language (1 point)
  if (hasEngagingLanguage(question)) score += 1
  
  return score
}

function hasLogicalConsistency(question: string, answer: string): boolean {
  // Check for logical connections between question and answer
  const questionWords = question.toLowerCase().split(/\s+/)
  const answerWords = answer.toLowerCase().split(/\s+/)
  
  // Look for meaningful connections
  const connections = [
    { q: 'face', a: 'clock', valid: true },
    { q: 'hands', a: 'clock', valid: true },
    { q: 'roots', a: 'tree', valid: true },
    { q: 'memory', a: 'computer', valid: true },
    { q: 'wheels', a: 'bike', valid: true },
    { q: 'foot', a: 'snail', valid: true },
    { q: 'threads', a: 'screw', valid: true }
  ]
  
  for (const { q, a, valid } of connections) {
    if (questionWords.includes(q) && answerWords.includes(a)) {
      return valid
    }
  }
  
  return true // Default to true if no specific patterns match
}

function hasGoodWordplay(question: string, answer: string): boolean {
  // Check for double meanings, wordplay, or clever misdirection
  const wordplayIndicators = [
    'face', 'hands', 'memory', 'roots', 'wheels', 'threads', 'foot', 'tail', 'head', 'body'
  ]
  
  const questionLower = question.toLowerCase()
  return wordplayIndicators.some(indicator => questionLower.includes(indicator))
}

function hasClearSolutionPath(question: string, answer: string): boolean {
  // Check if the riddle provides a clear path to solution
  const clearPathIndicators = [
    'what has', 'what is', 'what goes', 'what can', 'what does',
    'i have', 'i am', 'i go', 'i can'
  ]
  
  const questionLower = question.toLowerCase()
  return clearPathIndicators.some(indicator => questionLower.includes(indicator))
}

function hasProperScope(question: string, answer: string): boolean {
  // Check if the answer is specific enough
  const answerLower = answer.toLowerCase()
  const tooVague = ['thing', 'object', 'item', 'stuff', 'something']
  
  return !tooVague.some(vague => answerLower.includes(vague))
}

function hasEngagingLanguage(question: string): boolean {
  // Check for engaging, playful language
  const engagingWords = ['clever', 'mystery', 'puzzle', 'riddle', 'guess']
  const questionLower = question.toLowerCase()
  
  return questionLower.length > 20 && questionLower.length < 80
}


