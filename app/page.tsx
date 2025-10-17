'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Zap, Brain, BookOpen, Shield, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'
import { AuthButton } from '@/components/AuthButton'
import { useAuth } from '@/contexts/AuthContext'
import { saveUserQuestion } from '@/lib/userQuestions'
import { callGenerateAPI } from '@/lib/api'

// Function to get random story prompt
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

export default function Home() {
  const { user } = useAuth()
  const [showGenerator, setShowGenerator] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('')
  const [roastContent, setRoastContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showAnswers, setShowAnswers] = useState<boolean[]>([])

  // Function to save user questions to Firebase
  const saveQuestionToFirebase = async (question: string, response: string, category: string, isRandom: boolean = false) => {
    if (user) {
      try {
        const startTime = Date.now()
        const wordCount = response.split(' ').length
        
        await saveUserQuestion({
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          userEmail: user.email || '',
          question,
          response,
          category: category as 'roasts' | 'puns' | 'riddles' | 'stories',
          prompt: question,
          isRandom,
          wordCount,
          responseTime: Date.now() - startTime
        })
        console.log('Question saved successfully')
      } catch (error) {
        console.error('Failed to save question:', error)
      }
    }
  }

  // Pool of 500 diverse prompts for kid-friendly riddle generation
  const riddlePrompts = [
    // Animals & Pets
    "Generate riddles about cute pets like cats and dogs",
    "Create riddles about farm animals like cows and pigs",
    "Make riddles about wild animals like lions and elephants",
    "Generate riddles about birds like parrots and owls",
    "Create riddles about sea animals like dolphins and fish",
    "Make riddles about insects like butterflies and bees",
    "Generate riddles about zoo animals that kids love",
    "Create riddles about baby animals and their names",
    "Make riddles about animal sounds and behaviors",
    "Generate riddles about animal homes and habitats",
    "Create riddles about pets that kids might have",
    "Make riddles about animals in children's stories",
    "Generate riddles about animals that make kids laugh",
    "Create riddles about animals with special features",
    "Make riddles about animals that kids can see in their backyard",
    "Generate riddles about animals in cartoons and movies",
    "Create riddles about animals that are big and small",
    "Make riddles about animals that fly, swim, or walk",
    "Generate riddles about animals with different colors",
    "Create riddles about animals that make different sounds",
    
    // Toys & Games
    "Generate riddles about fun toys like dolls and action figures",
    "Create riddles about board games and puzzles",
    "Make riddles about outdoor toys like balls and bikes",
    "Generate riddles about building toys like blocks and LEGO",
    "Create riddles about electronic toys and games",
    "Make riddles about art supplies like crayons and paint",
    "Generate riddles about playground equipment",
    "Create riddles about sports equipment for kids",
    "Make riddles about musical toys and instruments",
    "Generate riddles about pretend play toys",
    "Create riddles about educational toys",
    "Make riddles about collectible toys",
    "Generate riddles about water toys and pool games",
    "Create riddles about party games and activities",
    "Make riddles about card games for kids",
    "Generate riddles about video games and consoles",
    "Create riddles about craft supplies and materials",
    "Make riddles about toy vehicles and cars",
    "Generate riddles about stuffed animals and plush toys",
    "Create riddles about magic tricks and props",
    
    // Food & Snacks
    "Generate riddles about yummy fruits like apples and bananas",
    "Create riddles about colorful vegetables like carrots and broccoli",
    "Make riddles about sweet treats like cookies and ice cream",
    "Generate riddles about breakfast foods like cereal and pancakes",
    "Create riddles about lunch foods like sandwiches and pizza",
    "Make riddles about healthy snacks like nuts and yogurt",
    "Generate riddles about drinks like juice and milk",
    "Create riddles about candy and chocolate treats",
    "Make riddles about birthday cake and party foods",
    "Generate riddles about picnic foods and outdoor meals",
    "Create riddles about cooking ingredients kids know",
    "Make riddles about foods that are round, square, or long",
    "Generate riddles about foods that are hot or cold",
    "Create riddles about foods that are crunchy or soft",
    "Make riddles about foods that are sweet or salty",
    "Generate riddles about foods that are colorful",
    "Create riddles about foods that grow on trees or in the ground",
    "Make riddles about foods that come from animals",
    "Generate riddles about foods that are good for you",
    "Create riddles about foods that are fun to eat",
    
    // School & Learning
    "Generate riddles about school supplies like pencils and erasers",
    "Create riddles about classroom items like desks and chairs",
    "Make riddles about books and reading materials",
    "Generate riddles about art supplies like markers and paper",
    "Create riddles about science tools like magnifying glasses",
    "Make riddles about math tools like rulers and calculators",
    "Generate riddles about school subjects kids study",
    "Create riddles about school activities and events",
    "Make riddles about teachers and school staff",
    "Generate riddles about school buildings and rooms",
    "Create riddles about homework and assignments",
    "Make riddles about school buses and transportation",
    "Generate riddles about playground equipment and recess",
    "Create riddles about school lunch and cafeteria",
    "Make riddles about school clubs and activities",
    "Generate riddles about school supplies that are colorful",
    "Create riddles about things you find in a backpack",
    "Make riddles about school rules and behavior",
    "Generate riddles about learning and studying",
    "Create riddles about school friends and classmates",
    
    // Body Parts & Health
    "Generate riddles about body parts like hands and feet",
    "Create riddles about facial features like eyes and nose",
    "Make riddles about things you can do with your body",
    "Generate riddles about healthy habits like brushing teeth",
    "Create riddles about exercise and physical activity",
    "Make riddles about things that help you stay healthy",
    "Generate riddles about body parts that help you move",
    "Create riddles about body parts that help you sense things",
    "Make riddles about things that grow on your body",
    "Generate riddles about body parts that come in pairs",
    "Create riddles about things you can do with your hands",
    "Make riddles about things you can do with your feet",
    "Generate riddles about body parts that are soft or hard",
    "Create riddles about body parts that are big or small",
    "Make riddles about things that help you breathe",
    "Generate riddles about things that help you see",
    "Create riddles about things that help you hear",
    "Make riddles about things that help you taste",
    "Generate riddles about things that help you smell",
    "Create riddles about things that help you touch",
    
    // Fun Activities & Hobbies
    "Generate riddles about fun outdoor activities",
    "Create riddles about indoor games and activities",
    "Make riddles about sports and physical games",
    "Generate riddles about arts and crafts activities",
    "Create riddles about music and dancing",
    "Make riddles about reading and storytelling",
    "Generate riddles about building and creating things",
    "Create riddles about exploring and discovering",
    "Make riddles about playing with friends",
    "Generate riddles about family activities",
    "Create riddles about holiday celebrations",
    "Make riddles about birthday parties and fun events",
    "Generate riddles about summer activities",
    "Create riddles about winter activities",
    "Make riddles about spring activities",
    "Generate riddles about fall activities",
    "Create riddles about water activities and swimming",
    "Make riddles about camping and outdoor adventures",
    "Generate riddles about cooking and baking fun",
    "Create riddles about gardening and growing things",
    
    // Seasons & Weather
    "Generate riddles about sunny days and warm weather",
    "Create riddles about rainy days and storms",
    "Make riddles about snowy days and winter fun",
    "Generate riddles about windy days and breezes",
    "Create riddles about cloudy days and overcast skies",
    "Make riddles about hot summer days",
    "Generate riddles about cool autumn days",
    "Create riddles about spring flowers and growth",
    "Make riddles about winter snow and ice",
    "Generate riddles about weather that's good for playing",
    "Create riddles about weather that keeps you inside",
    "Make riddles about weather that's fun to watch",
    "Generate riddles about weather that helps plants grow",
    "Create riddles about weather that's good for swimming",
    "Make riddles about weather that's good for building snowmen",
    "Generate riddles about weather that's good for flying kites",
    "Create riddles about weather that's good for picnics",
    "Make riddles about weather that's good for sledding",
    "Generate riddles about weather that's good for gardening",
    "Create riddles about weather that's good for camping",
    
    // Colors & Art
    "Generate riddles about bright colors like red and blue",
    "Create riddles about colorful things like rainbows",
    "Make riddles about art supplies like paint and brushes",
    "Generate riddles about drawing and coloring",
    "Create riddles about painting and creating art",
    "Make riddles about colorful toys and objects",
    "Generate riddles about things that are red, blue, or green",
    "Create riddles about things that are yellow, orange, or purple",
    "Make riddles about things that are black, white, or gray",
    "Generate riddles about colorful foods and snacks",
    "Create riddles about colorful flowers and plants",
    "Make riddles about colorful clothes and accessories",
    "Generate riddles about colorful animals and creatures",
    "Create riddles about colorful games and toys",
    "Make riddles about colorful books and stories",
    "Generate riddles about colorful decorations and ornaments",
    "Create riddles about colorful lights and displays",
    "Make riddles about colorful candy and treats",
    "Generate riddles about colorful balloons and party supplies",
    "Create riddles about colorful nature and outdoor things",
    
    // Games & Sports
    "Generate riddles about fun board games for kids",
    "Create riddles about outdoor games and activities",
    "Make riddles about ball games and sports",
    "Generate riddles about playground games and fun",
    "Create riddles about card games and simple games",
    "Make riddles about puzzle games and brain teasers",
    "Generate riddles about team sports and cooperation",
    "Create riddles about individual sports and activities",
    "Make riddles about water games and swimming fun",
    "Generate riddles about running and jumping games",
    "Create riddles about throwing and catching games",
    "Make riddles about hiding and seeking games",
    "Generate riddles about tag and chase games",
    "Create riddles about racing and speed games",
    "Make riddles about balancing and coordination games",
    "Generate riddles about memory and thinking games",
    "Create riddles about creative and imaginative games",
    "Make riddles about competitive and friendly games",
    "Generate riddles about games you play with friends",
    "Create riddles about games you play with family",
    
    // Transportation & Vehicles
    "Generate riddles about cars and trucks that kids see",
    "Create riddles about buses and school transportation",
    "Make riddles about bicycles and tricycles",
    "Generate riddles about trains and choo-choo trains",
    "Create riddles about planes and flying machines",
    "Make riddles about boats and ships on water",
    "Generate riddles about toy vehicles and cars",
    "Create riddles about emergency vehicles like fire trucks",
    "Make riddles about construction vehicles and big trucks",
    "Generate riddles about motorcycles and scooters",
    "Create riddles about skateboards and roller skates",
    "Make riddles about wagons and wheeled toys",
    "Generate riddles about strollers and baby carriages",
    "Create riddles about wheelchairs and mobility aids",
    "Make riddles about sleds and winter vehicles",
    "Generate riddles about go-karts and racing cars",
    "Create riddles about bumper cars and amusement rides",
    "Make riddles about toy trains and model vehicles",
    "Generate riddles about remote control cars and toys",
    "Create riddles about vehicles that make different sounds",
    
    // Buildings & Places
    "Generate riddles about houses and homes where kids live",
    "Create riddles about schools and classrooms",
    "Make riddles about playgrounds and parks",
    "Generate riddles about libraries and book places",
    "Create riddles about stores and shopping places",
    "Make riddles about restaurants and food places",
    "Generate riddles about hospitals and doctor places",
    "Create riddles about fire stations and emergency places",
    "Make riddles about zoos and animal places",
    "Generate riddles about museums and learning places",
    "Create riddles about movie theaters and entertainment places",
    "Make riddles about swimming pools and water places",
    "Generate riddles about ice cream shops and treat places",
    "Create riddles about toy stores and fun places",
    "Make riddles about amusement parks and ride places",
    "Generate riddles about farms and animal places",
    "Create riddles about beaches and vacation places",
    "Make riddles about camps and outdoor places",
    "Generate riddles about birthday party places",
    "Create riddles about places where kids have fun",
    
    // Weather & Nature
    "Generate riddles about sunny days and bright weather",
    "Create riddles about rainy days and water falling",
    "Make riddles about snowy days and white weather",
    "Generate riddles about windy days and breezy weather",
    "Create riddles about cloudy days and gray weather",
    "Make riddles about stormy days and loud weather",
    "Generate riddles about hot days and warm weather",
    "Create riddles about cold days and chilly weather",
    "Make riddles about foggy days and misty weather",
    "Generate riddles about rainbow days and colorful weather",
    "Create riddles about weather that's good for playing outside",
    "Make riddles about weather that keeps you inside",
    "Generate riddles about weather that's fun to watch",
    "Create riddles about weather that helps plants grow",
    "Make riddles about weather that's good for swimming",
    "Generate riddles about weather that's good for building snowmen",
    "Create riddles about weather that's good for flying kites",
    "Make riddles about weather that's good for picnics",
    "Generate riddles about weather that's good for sledding",
    "Create riddles about weather that's good for gardening",
    
    // Music & Sounds
    "Generate riddles about musical instruments kids know",
    "Create riddles about fun songs and nursery rhymes",
    "Make riddles about musical toys and instruments",
    "Generate riddles about sounds that animals make",
    "Create riddles about sounds that vehicles make",
    "Make riddles about sounds that nature makes",
    "Generate riddles about sounds that are loud or quiet",
    "Create riddles about sounds that are high or low",
    "Make riddles about sounds that are fast or slow",
    "Generate riddles about sounds that are happy or sad",
    "Create riddles about sounds that are scary or funny",
    "Make riddles about sounds that are musical or noisy",
    "Generate riddles about sounds that help you sleep",
    "Create riddles about sounds that wake you up",
    "Make riddles about sounds that make you dance",
    "Generate riddles about sounds that make you sing",
    "Create riddles about sounds that make you laugh",
    "Make riddles about sounds that make you think",
    "Generate riddles about sounds that are familiar",
    "Create riddles about sounds that are mysterious",
    
    // Words & Language
    "Generate riddles about fun words and silly words",
    "Create riddles about rhyming words and word play",
    "Make riddles about words that sound the same",
    "Generate riddles about words that mean the opposite",
    "Create riddles about words that are long or short",
    "Make riddles about words that are easy or hard to say",
    "Generate riddles about words that are funny or serious",
    "Create riddles about words that describe colors",
    "Make riddles about words that describe sizes",
    "Generate riddles about words that describe feelings",
    "Create riddles about words that describe actions",
    "Make riddles about words that describe things",
    "Generate riddles about words that describe places",
    "Create riddles about words that describe people",
    "Make riddles about words that describe animals",
    "Generate riddles about words that describe food",
    "Create riddles about words that describe toys",
    "Make riddles about words that describe games",
    "Generate riddles about words that describe weather",
    "Create riddles about words that describe sounds",
    
    // Numbers & Math
    "Generate riddles about counting numbers and counting",
    "Create riddles about shapes and geometric forms",
    "Make riddles about sizes like big and small",
    "Generate riddles about amounts like many and few",
    "Create riddles about measurements like tall and short",
    "Make riddles about patterns and sequences",
    "Generate riddles about addition and subtraction",
    "Create riddles about multiplication and division",
    "Make riddles about fractions and parts of things",
    "Generate riddles about time and clocks",
    "Create riddles about money and coins",
    "Make riddles about weight and heavy things",
    "Generate riddles about distance and far things",
    "Create riddles about speed and fast things",
    "Make riddles about temperature and hot things",
    "Generate riddles about age and old things",
    "Create riddles about quantity and how many",
    "Make riddles about order and first things",
    "Generate riddles about comparison and different things",
    "Create riddles about logic and thinking",
    
    // Space & Sky
    "Generate riddles about the sun and its brightness",
    "Create riddles about the moon and its phases",
    "Make riddles about stars and their twinkling",
    "Generate riddles about planets and their colors",
    "Create riddles about rockets and space travel",
    "Make riddles about astronauts and space suits",
    "Generate riddles about satellites and space objects",
    "Create riddles about telescopes and stargazing",
    "Make riddles about constellations and star patterns",
    "Generate riddles about comets and shooting stars",
    "Create riddles about space stations and space homes",
    "Make riddles about gravity and floating in space",
    "Generate riddles about space exploration and discovery",
    "Create riddles about aliens and space creatures",
    "Make riddles about space ships and space vehicles",
    "Generate riddles about space food and space living",
    "Create riddles about space walks and space activities",
    "Make riddles about space missions and space adventures",
    "Generate riddles about space technology and space tools",
    "Create riddles about space mysteries and space wonders",
    
    // Fun Concepts
    "Generate riddles about fun and happiness",
    "Create riddles about friendship and being together",
    "Make riddles about family and loved ones",
    "Generate riddles about love and caring",
    "Create riddles about kindness and helping others",
    "Make riddles about sharing and giving",
    "Generate riddles about learning and growing",
    "Create riddles about trying and never giving up",
    "Make riddles about being brave and courageous",
    "Generate riddles about being honest and truthful",
    "Create riddles about being helpful and useful",
    "Make riddles about being creative and imaginative",
    "Generate riddles about being curious and wondering",
    "Create riddles about being patient and waiting",
    "Make riddles about being grateful and thankful",
    "Generate riddles about being respectful and polite",
    "Create riddles about being responsible and reliable",
    "Make riddles about being fair and just",
    "Generate riddles about being peaceful and calm",
    "Create riddles about being joyful and cheerful",
    
    // Nature & Elements
    "Generate riddles about trees and their leaves",
    "Create riddles about flowers and their petals",
    "Make riddles about grass and green things",
    "Generate riddles about water and its forms",
    "Create riddles about fire and its warmth",
    "Make riddles about air and its movement",
    "Generate riddles about earth and its soil",
    "Create riddles about rocks and their shapes",
    "Make riddles about sand and its texture",
    "Generate riddles about ice and its coldness",
    "Create riddles about snow and its whiteness",
    "Make riddles about rain and its wetness",
    "Generate riddles about wind and its blowing",
    "Create riddles about sunshine and its brightness",
    "Make riddles about clouds and their shapes",
    "Generate riddles about mountains and their height",
    "Create riddles about rivers and their flowing",
    "Make riddles about lakes and their stillness",
    "Generate riddles about oceans and their vastness",
    "Create riddles about forests and their trees",
    
    // Daily Activities
    "Generate riddles about eating and mealtime",
    "Create riddles about sleeping and bedtime",
    "Make riddles about playing and having fun",
    "Generate riddles about learning and studying",
    "Create riddles about working and helping",
    "Make riddles about cleaning and organizing",
    "Generate riddles about cooking and baking",
    "Create riddles about gardening and growing",
    "Generate riddles about reading and stories",
    "Create riddles about writing and drawing",
    "Make riddles about singing and music",
    "Generate riddles about dancing and movement",
    "Create riddles about swimming and water fun",
    "Make riddles about running and exercise",
    "Generate riddles about jumping and bouncing",
    "Create riddles about climbing and reaching",
    "Make riddles about building and creating",
    "Generate riddles about fixing and repairing",
    "Create riddles about sharing and giving",
    "Make riddles about caring and helping",
    
    // Household Objects
    "Generate riddles about things in the kitchen",
    "Create riddles about things in the bathroom",
    "Make riddles about things in the bedroom",
    "Generate riddles about things in the living room",
    "Create riddles about things in the garage",
    "Make riddles about things in the yard",
    "Generate riddles about things that are round",
    "Create riddles about things that are square",
    "Make riddles about things that are long",
    "Generate riddles about things that are short",
    "Generate riddles about things that are big",
    "Create riddles about things that are small",
    "Make riddles about things that are heavy",
    "Generate riddles about things that are light",
    "Create riddles about things that are soft",
    "Make riddles about things that are hard",
    "Generate riddles about things that are smooth",
    "Create riddles about things that are rough",
    "Make riddles about things that are shiny",
    "Create riddles about things that are dull",
    
    // Fun & Playful
    "Generate riddles about silly and funny things",
    "Create riddles about things that make you laugh",
    "Make riddles about things that are surprising",
    "Generate riddles about things that are amazing",
    "Create riddles about things that are wonderful",
    "Make riddles about things that are magical",
    "Generate riddles about things that are mysterious",
    "Create riddles about things that are puzzling",
    "Make riddles about things that are interesting",
    "Generate riddles about things that are exciting",
    "Create riddles about things that are adventurous",
    "Make riddles about things that are imaginative",
    "Generate riddles about things that are creative",
    "Create riddles about things that are colorful",
    "Make riddles about things that are bright",
    "Generate riddles about things that are shiny",
    "Create riddles about things that are sparkly",
    "Make riddles about things that are beautiful",
    "Generate riddles about things that are pretty",
    "Create riddles about things that are cute",
    
    // Special Things
    "Generate riddles about shadows and dark shapes",
    "Create riddles about reflections and mirrors",
    "Make riddles about echoes and repeating sounds",
    "Generate riddles about rainbows and colorful arcs",
    "Create riddles about bubbles and floating spheres",
    "Make riddles about balloons and floating objects",
    "Generate riddles about kites and flying things",
    "Create riddles about magnets and attracting things",
    "Make riddles about compasses and direction finders",
    "Generate riddles about thermometers and temperature",
    "Create riddles about clocks and time telling",
    "Make riddles about calendars and date keeping",
    "Generate riddles about maps and location finding",
    "Create riddles about keys and unlocking things",
    "Make riddles about locks and securing things",
    "Generate riddles about buttons and fastening things",
    "Create riddles about zippers and closing things",
    "Make riddles about velcro and sticking things",
    "Generate riddles about tape and attaching things",
    "Create riddles about glue and joining things",
    
    // Final Batch - Fun & Creative
    "Generate riddles about things that are round and roll",
    "Create riddles about things that are square and stack",
    "Make riddles about things that are long and stretch",
    "Generate riddles about things that are short and compact",
    "Create riddles about things that are big and take up space",
    "Make riddles about things that are small and fit anywhere",
    "Generate riddles about things that are heavy and hard to lift",
    "Create riddles about things that are light and easy to carry",
    "Make riddles about things that are soft and comfortable",
    "Generate riddles about things that are hard and durable",
    "Create riddles about things that are smooth and slippery",
    "Make riddles about things that are rough and textured",
    "Generate riddles about things that are shiny and reflective",
    "Create riddles about things that are dull and matte",
    "Make riddles about things that are bright and colorful",
    "Generate riddles about things that are dark and mysterious",
    "Create riddles about things that are hot and warm",
    "Make riddles about things that are cold and cool",
    "Generate riddles about things that are wet and watery",
    "Create riddles about things that are dry and solid"
  ]

  // Content filtering function
  const containsInappropriateContent = (text: string): boolean => {
    const inappropriateKeywords = [
      'sex', 'sexual', 'porn', 'pornographic', 'masturbat', 'orgasm', 'penis', 'vagina', 'breast', 'nipple',
      'condom', 'dildo', 'vibrator', 'fetish', 'bondage', 'bdsm', 'prostitute', 'hooker', 'escort',
      'rape', 'molest', 'pedophil', 'incest', 'bestiality', 'zoophil', 'necrophil', 'exhibitionist',
      'voyeur', 'fisting', 'anal', 'oral sex', 'blow job', 'hand job', 'rim job', 'golden shower',
      'scat', 'coprophil', 'urine', 'urination', 'defecat', 'genital', 'pubic', 'clitoris', 'testicle',
      'ejaculat', 'sperm', 'cum', 'jizz', 'creampie', 'gangbang', 'threesome', 'orgy', 'swinger',
      'strip', 'stripper', 'lap dance', 'escort', 'brothel', 'whore', 'slut', 'bitch', 'cunt',
      'fuck', 'fucking', 'fucked', 'motherfucker', 'asshole', 'dickhead', 'pussy', 'cock', 'dick',
      'gay', 'lesbian', 'homosexual', 'lgbt', 'lgbtq', 'queer', 'bisexual',
      'pansexual', 'asexual', 'non-binary', 'sexuality'
    ]
    
    // Legitimate words that should not be flagged
    const legitimateWords = [
      'transformers', 'transformer', 'optimus prime', 'megatron', 'bumblebee', 'autobots', 'decepticons',
      'transmission', 'transport', 'translate', 'transparent', 'transaction', 'transfer', 'transform',
      'transatlantic', 'transcontinental', 'transcribe', 'transcript', 'transit', 'transition',
      'transplant', 'transpose', 'transverse', 'transient', 'transcend', 'transcendent'
    ]
    
    const lowerText = text.toLowerCase()
    
    // First check if it contains any legitimate words - if so, allow it
    if (legitimateWords.some(word => lowerText.includes(word))) {
      return false
    }
    
    // Then check for inappropriate content
    return inappropriateKeywords.some(keyword => lowerText.includes(keyword))
  }

  const generateRoast = async () => {
    // Check if input is empty
    if (!customPrompt.trim()) {
      setRoastContent('Please enter something to roast first! Be specific for better results.')
      return
    }
    
    // Check for inappropriate content
    if (containsInappropriateContent(customPrompt)) {
      setRoastContent('Please enter appropriate content.')
      return
    }
    
    setIsLoading(true)
    setRoastContent('')
    
    const prompt = `Generate a playful roast about: ${customPrompt}. Make it funny but not mean-spirited.`
    
    try {
      const data = await callGenerateAPI('roasts', prompt)
      
      if (data.success) {
        setRoastContent(data.content)
        setCustomPrompt('') // Clear the input after successful generation
        // Save to Firebase if user is signed in
        await saveQuestionToFirebase(customPrompt || 'Random roast', data.content, 'roasts', !customPrompt.trim())
      } else {
        setRoastContent(data.error || 'Unable to generate roasts at this time. Please try again.')
        setCustomPrompt('') // Clear the input after error
      }
    } catch (error) {
      console.error('Error generating roast:', error)
      setRoastContent('Unable to generate roasts at this time. Please try again.')
      setCustomPrompt('') // Clear the input after error fallback too
    } finally {
      setIsLoading(false)
    }
  }

  const generatePuns = async () => {
    // Check if input is empty
    if (!customPrompt.trim()) {
      setRoastContent('Please enter a topic for puns! Be specific for better results.')
      return
    }
    
    // Check for inappropriate content
    if (containsInappropriateContent(customPrompt)) {
      setRoastContent('Please enter appropriate content.')
      return
    }
    
    setIsLoading(true)
    setRoastContent('')
    
    const prompt = `Generate clever puns about: ${customPrompt}. Make them groan-worthy and creative.`
    
    try {
      const data = await callGenerateAPI('puns', prompt)
      
      if (data.success) {
        setRoastContent(data.content)
        setCustomPrompt('') // Clear the input after successful generation
        // Save to Firebase if user is signed in
        await saveQuestionToFirebase(customPrompt || 'Random puns', data.content, 'puns', !customPrompt.trim())
      } else {
        setRoastContent(data.error || 'Unable to generate puns at this time. Please try again.')
        setCustomPrompt('') // Clear the input after error
      }
    } catch (error) {
      console.error('Error generating puns:', error)
      setRoastContent('Unable to generate puns at this time. Please try again.')
      setCustomPrompt('') // Clear the input after error fallback too
    } finally {
      setIsLoading(false)
    }
  }

  const generateStory = async () => {
    setIsLoading(true)
    setRoastContent('')
    
    const randomStoryPrompt = getRandomStoryPrompt()
    const prompt = `Generate a funny joke story about ${randomStoryPrompt}. Follow the classic structure with setup, misdirection, and a satisfying twist. Write EXACTLY 1 paragraph with 4-6 sentences. ONE clear twist, no multiple punchlines, no puns. Keep it concise and captivating.`
    
    try {
      const data = await callGenerateAPI('stories', prompt)
      
      if (data.success) {
        setRoastContent(data.content)
        // Save to Firebase if user is signed in
        await saveQuestionToFirebase('Random story', data.content, 'stories', true)
      } else {
        setRoastContent(data.error || 'Unable to generate story at this time. Please try again.')
      }
    } catch (error) {
      console.error('Error generating story:', error)
      setRoastContent('Unable to generate story at this time. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const generateRandomRoast = async () => {
    setIsLoading(true)
    setRoastContent('')
    
    const prompt = 'Generate a playful roast about a random topic. Make it funny but not mean-spirited.'
    
    try {
      const data = await callGenerateAPI('roasts', prompt)
      
      if (data.success) {
        setRoastContent(data.content)
        // Save to Firebase if user is signed in
        await saveQuestionToFirebase('Random roast', data.content, 'roasts', true)
      } else {
        setRoastContent(data.error || 'Unable to generate roasts at this time. Please try again.')
      }
    } catch (error) {
      console.error('Error generating random roast:', error)
      setRoastContent('Unable to generate roasts at this time. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRandomPuns = async () => {
    setIsLoading(true)
    setRoastContent('')
    
    const prompt = 'Generate clever puns about a random topic. Make them groan-worthy and creative.'
    
    try {
      const data = await callGenerateAPI('puns', prompt)
      
      if (data.success) {
        setRoastContent(data.content)
        // Save to Firebase if user is signed in
        await saveQuestionToFirebase('Random puns', data.content, 'puns', true)
      } else {
        setRoastContent(data.error || 'Unable to generate puns at this time. Please try again.')
      }
    } catch (error) {
      console.error('Error generating random puns:', error)
      setRoastContent('Unable to generate puns at this time. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRiddles = async () => {
    setIsLoading(true)
    setRoastContent('')
    setShowAnswers([])
    
    const riddleCount = 5
    const riddles = []
    
    // Generate each riddle from a different random prompt
    for (let i = 0; i < riddleCount; i++) {
      const randomPrompt = riddlePrompts[Math.floor(Math.random() * riddlePrompts.length)]
      
      const prompt = `Generate 1 SHORT, clever riddle based on this theme: ${randomPrompt}. 

🔑 PROFESSIONAL QUALITY STANDARDS - MUST MEET ALL:

1. LOGICAL CONSISTENCY - Every clue must have a direct, factual connection to the answer with no contradictions
2. CLEAR WORDPLAY - Use strong double meanings (face=clock face, hands=clock hands) or clever misdirection  
3. SATISFYING SOLUTION - Provide a clear path to the answer that feels rewarding to solve
4. PROPER SCOPE - Clues specific enough to point to one primary answer without being vague
5. ENGAGING LANGUAGE - Playful, clever phrasing that draws people in
6. PRECISE LANGUAGE - Avoid vague words like 'helps', 'useful', 'good', 'nice' - be specific about functions
7. Keep It Short & Snappy - One simple sentence, MAXIMUM 15 WORDS

QUALITY CHECKLIST - VERIFY BEFORE SUBMITTING:
✓ Does every word in the riddle logically connect to the answer?
✓ Is there clear wordplay or misdirection?
✓ Would solving this feel satisfying?
✓ Is the answer specific and unambiguous?
✓ Does the language engage the reader?
✓ Are all words precise and factual (no vague terms)?

CORRECT EXAMPLES (PROFESSIONAL STANDARD):
- "What has a face but no eyes?" → Answer: "A clock" (face=clock face, no eyes=correct)
- "What has roots but no legs?" → Answer: "A tree" (roots=tree roots, no legs=correct)  
- "What has a memory but forgets?" → Answer: "A computer" (memory=computer memory, forgets=correct)
- "What has wheels but no legs?" → Answer: "A bike" (wheels=bike wheels, no legs=correct)
- "What has threads but can't walk?" → Answer: "A screw" (threads=screw threads, can't walk=correct)

FORBIDDEN - NEVER CREATE THESE (PROFESSIONAL STANDARDS):
- "What has a foot but no legs?" → "A shoe" (WRONG - shoes don't HAVE feet)
- "What has threads but can't walk?" → "A needle" (WRONG - needles don't HAVE threads)
- "What has hands but helps?" → "A clock" (WRONG - 'helps' is vague/imprecise)
- "What has space but no room?" → "A desk" (WRONG - desks HAVE room)
- "What corn can you eat?" → "Popcorn" (WRONG - uses word from answer)
- "What is cold but can't be held?" → "Ice" (WRONG - ice CAN be held)
- "What has a seat but can't sit?" → "Chair" (WRONG - chairs CAN sit)

Format: RIDDLE: [riddle text] ANSWER: [answer]`
      
      const category = 'short-riddles'
      
      try {
        const data = await callGenerateAPI(category, prompt)
        
        if (data.success) {
          // Check if the riddle is good quality
          const parsedRiddles = parseRiddleContent(data.content)
          if (parsedRiddles.length > 0 && isGoodRiddle(parsedRiddles[0].riddle, parsedRiddles[0].answer)) {
            riddles.push(data.content)
          } else {
            // Try again with a different approach
            const retryData = await callGenerateAPI('short-riddles', `Generate 1 clever riddle about ${randomPrompt}. Use wordplay or logic. Must be unexpected but logical. Examples: "What has hands and a face, but can't smile or clap?" → "A clock". "What gets wetter the more it dries?" → "A towel". Format: RIDDLE: [riddle] ANSWER: [answer]`)
            if (retryData.success) {
              riddles.push(retryData.content)
            } else {
              riddles.push(retryData.error || 'Unable to generate this riddle.')
            }
          }
        } else {
          riddles.push(data.error || 'Unable to generate this riddle.')
        }
      } catch (error) {
        console.error('Error generating riddle:', error)
        riddles.push('Unable to generate this riddle.')
      }
    }
    
    // Combine all riddles
    const combinedContent = riddles.join('\n\n')
    setRoastContent(combinedContent)
    
    // Save to Firebase if user is signed in
    await saveQuestionToFirebase('Random riddles', combinedContent, 'riddles', true)
    
    // Initialize answer visibility array
    setShowAnswers(new Array(riddleCount).fill(false))
    setIsLoading(false)
  }



  // Function to toggle individual answer visibility
  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = !newAnswers[index]
      return newAnswers
    })
  }

  // Function to validate if a riddle is good quality
  const isGoodRiddle = (riddle: string, answer: string): boolean => {
    const riddleLower = riddle.toLowerCase()
    const answerLower = answer.toLowerCase()
    
    // 🔑 1. Match Clues to the Answer - Check for contradictions
    const contradictoryPatterns = [
      // Real-world contradictions
      riddleLower.includes("can't be held") && answerLower.includes("ice"),
      riddleLower.includes("can't be touched") && answerLower.includes("ice"),
      riddleLower.includes("can't sit") && answerLower.includes("chair"),
      riddleLower.includes("can't learn") && answerLower.includes("teacher"),
      riddleLower.includes("can't breathe") && answerLower.includes("wind"),
      riddleLower.includes("no brain") && answerLower.includes("computer"),
    ]
    
    // 🔑 2. Keep It Short & Snappy - Check word count
    const wordCount = riddleLower.split(' ').length
    if (wordCount > 15) {
      return false
    }
    
    // 🔑 3. Balance Difficulty - Check for too easy or too obscure
    const tooEasyPatterns = [
      /what is a baby \w+\?/i.test(riddleLower),
      /what fruit has a \w+\?/i.test(riddleLower),
      /what is \w+ when \w+\?/i.test(riddleLower),
      /what is always \w+\?/i.test(riddleLower),
      /what corn can you eat/i.test(riddleLower),
      /why are \w+ rich/i.test(riddleLower),
      /what fruit is always \w+/i.test(riddleLower),
      /what is short and \w+/i.test(riddleLower),
      /what has color but no \w+/i.test(riddleLower),
      /what shines with no \w+/i.test(riddleLower),
      /what is \w+ and \w+\?/i.test(riddleLower),
      /why \w+ \w+ \w+\?/i.test(riddleLower) && wordCount < 8,
    ]
    
    // 🔑 4. Use Double Meanings - Check for wordplay
    const hasWordplay = riddleLower.includes("but") || riddleLower.includes("yet") || 
                       riddleLower.includes("never") || riddleLower.includes("always") ||
                       riddleLower.includes("more") || riddleLower.includes("less") ||
                       riddleLower.includes("can't") || riddleLower.includes("without") ||
                       riddleLower.includes("has") || riddleLower.includes("with")
    
    // 🔑 5. Avoid Contradictions - Check for real-world impossibilities
    const realWorldContradictions = [
      riddleLower.includes("can't sit") && answerLower.includes("chair"),
      riddleLower.includes("can't learn") && answerLower.includes("teacher"),
      riddleLower.includes("can't breathe") && answerLower.includes("wind"),
      riddleLower.includes("no brain") && answerLower.includes("computer"),
      riddleLower.includes("shines with no light") && answerLower.includes("light"),
      riddleLower.includes("shines with no light") && answerLower.includes("star"),
      riddleLower.includes("shines with no light") && answerLower.includes("diamond"),
    ]
    
    // 🔑 6. Test It Out - Check if answer feels like a stretch
    const stretchedAnswers = [
      riddleLower.includes("shore but no water") && answerLower.includes("keyboard"),
      riddleLower.includes("beach but no shore") && answerLower.includes("baseball"),
      riddleLower.includes("class but can't learn") && answerLower.includes("classroom"),
    ]
    
    // Uses words from answer (bad riddles)
    const usesAnswerWords = [
      riddleLower.includes("hog") && answerLower.includes("hog"),
      riddleLower.includes("corn") && answerLower.includes("corn"),
      riddleLower.includes("pig") && answerLower.includes("pig"),
      riddleLower.includes("shore") && answerLower.includes("shore"),
      riddleLower.includes("fruit") && answerLower.includes("fruit"),
    ]
    
    // Not actually riddles
    const notRiddles = [
      riddleLower.includes("what is") && wordCount < 8,
      riddleLower.includes("what are") && wordCount < 8,
      riddleLower.includes("why") && wordCount < 6,
    ]
    
    // Combine all forbidden patterns
    const forbiddenPatterns = [
      ...contradictoryPatterns,
      ...tooEasyPatterns,
      ...realWorldContradictions,
      ...stretchedAnswers,
      ...usesAnswerWords,
      ...notRiddles,
    ]
    
    // Reject if it matches forbidden patterns or lacks wordplay
    return !forbiddenPatterns.some(pattern => pattern === true) && hasWordplay
  }


  // Function to parse riddle content
  const parseRiddleContent = (content: string) => {
    const lines = content.split('\n')
    const riddles = []
    
    for (let i = 0; i < lines.length; i++) {
      // Handle both "RIDDLE:" and "1. RIDDLE:" formats
      if (lines[i].includes('RIDDLE:')) {
        let riddleLine = lines[i].replace(/^\d+\.\s*/, '').replace('RIDDLE:', '').trim()
        let answer = ''
        
        // Check if the answer is on the same line (separated by "ANSWER:")
        if (riddleLine.includes('ANSWER:')) {
          const parts = riddleLine.split('ANSWER:')
          riddleLine = parts[0].trim()
          answer = parts[1].trim()
        } else {
          // Look for the next line that starts with ANSWER:
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].includes('ANSWER:')) {
              answer = lines[j].replace(/^\d+\.\s*/, '').replace('ANSWER:', '').trim()
              break
            }
          }
        }
        
        // Only add if we have both riddle and answer
        if (riddleLine && answer) {
          riddles.push({ riddle: riddleLine, answer })
        }
      }
    }
    
    return riddles
  }

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category)
    setShowGenerator(true)
    
    if (category === 'roasts') {
      generateRoast()
    } else if (category === 'puns') {
      generatePuns()
    }
    // Stories and riddles no longer auto-generate - user must click generate button
  }

  const categories = [
    {
      id: 'roasts',
      name: 'Roasts',
      icon: Zap,
      description: 'Playful burns and witty insults',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      available: true
    },
    {
      id: 'puns',
      name: 'Puns',
      icon: Sparkles,
      description: 'Clever wordplay and groan-worthy jokes',
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      available: true
    },
    {
      id: 'riddles',
      name: 'Riddles',
      icon: Brain,
      description: 'Brain teasers and mind-bending puzzles',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      available: true
    },
    {
      id: 'stories',
      name: 'Stories',
      icon: BookOpen,
      description: 'Longer-form comedy narratives',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      available: true
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        {/* Top Navigation */}
        <div className="container mx-auto px-6 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 120 120" role="img" aria-labelledby="je-icon-small" xmlns="http://www.w3.org/2000/svg">
                    <title id="je-icon-small">The Joke Engine Icon</title>
                    
                    <defs>
                      <linearGradient id="cyan-glow-small" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#00FFF0" />
                        <stop offset="1" stopColor="#00C8FF" />
                      </linearGradient>
                    </defs>

                    <g transform="translate(60,60)">
                      <circle r="28" fill="none" stroke="url(#cyan-glow-small)" strokeWidth="6"/>
                      <g stroke="url(#cyan-glow-small)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <path d="M-44 -6 L -36 -2" />
                        <path d="M-36 2 L -28 6" />
                        <path d="M-8 44 L -2 36" />
                        <path d="M2 36 L 8 28" />
                        <path d="M44 6 L 36 2" />
                        <path d="M36 -2 L 28 -6" />
                        <path d="M8 -44 L 2 -36" />
                        <path d="M-2 -36 L -8 -28" />
                      </g>
                      <circle r="10" fill="none" stroke="url(#cyan-glow-small)" strokeWidth="5"/>
                      <polygon points="-6,-30 6,-6 0,-6 12,26 -6,6 2,6 -6,-30"
                               fill="url(#cyan-glow-small)" transform="rotate(-10) translate(2,0)"/>
                    </g>
                  </svg>
                </div>
                <div className="text-slate-400 text-sm font-semibold">
                  The Joke ENGINE
                </div>
              </div>
              {user && (
                <Link 
                  href="/users"
                  className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" />
                  View Users
                </Link>
              )}
            </div>
            {/* User Profile - Top Right */}
            {user && (
              <div className="flex justify-end">
                <AuthButton />
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12" viewBox="0 0 120 120" role="img" aria-labelledby="je-icon je-desc" xmlns="http://www.w3.org/2000/svg">
                  <title id="je-icon">The Joke Engine Icon</title>
                  <desc id="je-desc">Simplified 8-tooth gear with a lightning bolt replacing one tooth; single-color fill suitable for icons.</desc>

                  <defs>
                    <linearGradient id="cyan-glow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#00FFF0" />
                      <stop offset="1" stopColor="#00C8FF" />
                    </linearGradient>
                  </defs>

                  <g transform="translate(60,60)">
                    {/* gear body: approximate gear using circle + teeth drawn as rectangles rotated */}
                    <circle r="28" fill="none" stroke="url(#cyan-glow)" strokeWidth="6"/>
                    {/* teeth by manual path for clean silhouette */}
                    <g stroke="url(#cyan-glow)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                      <path d="M-44 -6 L -36 -2" />
                      <path d="M-36 2 L -28 6" />
                      <path d="M-8 44 L -2 36" />
                      <path d="M2 36 L 8 28" />
                      <path d="M44 6 L 36 2" />
                      <path d="M36 -2 L 28 -6" />
                      <path d="M8 -44 L 2 -36" />
                      <path d="M-2 -36 L -8 -28" />
                    </g>

                    {/* hollow center */}
                    <circle r="10" fill="none" stroke="url(#cyan-glow)" strokeWidth="5"/>

                    {/* lightning bolt that replaces a tooth (drawn as a filled polygon) */}
                    <polygon points="-6,-30 6,-6 0,-6 12,26 -6,6 2,6 -6,-30"
                             fill="url(#cyan-glow)" transform="rotate(-10) translate(2,0)"/>
                  </g>
                </svg>
              </div>
            </div>
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4 tracking-tight">
              The Joke ENGINE
            </h1>
            <p className="text-xl text-slate-300 mb-12 font-light">
              Free AI-powered joke generator creating hilarious roasts, clever puns, brain teasers, and funny stories instantly
            </p>
          </motion.div>

          {/* Professional Sign-in Landing */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              {/* Hero Section */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left Side - Features */}
                  <div className="text-left space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">AI-Powered Roasts</h3>
                          <p className="text-slate-400">Generate witty burns and playful insults</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Clever Puns</h3>
                          <p className="text-slate-400">Create groan-worthy wordplay and jokes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Brain Teasers</h3>
                          <p className="text-slate-400">Challenge yourself with mind-bending riddles</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Funny Stories</h3>
                          <p className="text-slate-400">Enjoy longer-form comedy narratives</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Sign-in Card */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">
                        Get Started
                      </h2>
                      <p className="text-slate-300 text-lg mb-8">
                        Sign in to unlock unlimited comedy generation
                      </p>
                    </div>
                    
                    {/* Enhanced Auth Button */}
                    <div className="mb-6">
                      <AuthButton />
                    </div>
                    
                    <div className="space-y-4 text-sm text-slate-400">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Save your comedy creations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Access premium features</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span>Track your usage stats</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">100%</div>
                    <div className="text-slate-400">Free to Use</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">Instant</div>
                    <div className="text-slate-400">AI Generation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">Secure</div>
                    <div className="text-slate-400">Google Sign-in</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Welcome Message for Signed-in Users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to create some comedy?
                </h2>
                <p className="text-slate-300 text-lg">
                  Choose a category below to start generating hilarious content. Your creations will be automatically saved to your account.
                </p>
              </div>
            </motion.div>
          )}

          {/* Categories Grid - Only show when logged in */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border-2 ${category.borderColor} ${category.bgColor} backdrop-blur-sm transition-all duration-300 ${
                  category.available 
                    ? 'cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => category.available && handleCategoryClick(category.id)}
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {category.name}
                  </h3>
                  
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    category.available 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {category.available ? '✓ Available' : 'Coming Soon'}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </div>
          )}

        </div>
      </div>

      {/* SEO Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-12 mt-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Joke Engine Features</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• AI Roast Generator - Create witty burns and playful insults</li>
                <li>• Puns Generator - Generate clever wordplay and groan-worthy jokes</li>
                <li>• Riddles Generator - Challenge yourself with brain teasers</li>
                <li>• Funny Stories Generator - Enjoy longer-form comedy narratives</li>
                <li>• Free to use with Google sign-in</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Comedy Categories</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Roasts - Playful burns and witty insults</li>
                <li>• Puns - Clever wordplay and creative jokes</li>
                <li>• Riddles - Mind-bending puzzles and brain teasers</li>
                <li>• Stories - Funny narratives and joke stories</li>
                <li>• Random Comedy - Surprise humor content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">About Joke Engine</h3>
              <p className="text-slate-300 text-sm mb-4">
                The Joke Engine is a free AI-powered comedy generator that creates hilarious content instantly. 
                Whether you need roasts, puns, riddles, or funny stories, our AI comedy generator delivers 
                high-quality humor content for entertainment, social media, or personal use.
              </p>
              <p className="text-slate-300 text-sm">
                No registration required - just sign in with Google to save your comedy creations and track your usage statistics.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 Joke Engine - Free AI Comedy Generator | Roasts, Puns, Riddles & Funny Stories
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {showGenerator && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                    currentCategory === 'roasts' ? 'from-red-500 to-orange-500' : 
                    currentCategory === 'puns' ? 'from-yellow-500 to-amber-500' : 
                    'from-blue-500 to-purple-500'
                  } flex items-center justify-center`}>
                    {currentCategory === 'roasts' ? (
                      <Zap className="w-6 h-6 text-white" />
                    ) : currentCategory === 'puns' ? (
                      <Sparkles className="w-6 h-6 text-white" />
                    ) : (
                      <Brain className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentCategory === 'roasts' ? 'Roast Generator' : 
                       currentCategory === 'puns' ? 'Puns Generator' : 
                       'Riddles Generator'}
                    </h2>
                    <p className="text-slate-400 text-sm">AI-powered comedy at your fingertips</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setShowGenerator(false)
                      setCurrentCategory('')
                      setRoastContent('')
                      setCustomPrompt('')
                    }}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-300 text-lg mb-6">
                    {currentCategory === 'roasts' 
                      ? "Tell me what you want to roast! Be specific for better results."
                      : currentCategory === 'puns' 
                      ? "Tell me what topic you want puns about! Be specific for better results."
                      : currentCategory === 'stories'
                      ? "Generate funny joke stories! Each story follows the classic structure with setup, misdirection, and a satisfying twist."
                      : `Generate fun riddles! All riddles are random and will challenge your mind.`
                    }
                  </p>
                  
                  {currentCategory !== 'riddles' && currentCategory !== 'stories' && (
                    <div className="mb-6">
                      <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder={currentCategory === 'roasts' 
                          ? "e.g., someone who's always late, bad drivers, people who don't use turn signals..."
                          : "e.g., food, animals, technology, weather, sports..."
                        }
                        className="w-full px-6 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-slate-700 transition-all duration-300 text-lg"
                      />
                      <p className="text-slate-500 text-sm mt-3">
                        {currentCategory === 'roasts' 
                          ? "Leave empty for a random roast, or be specific for targeted burns!"
                          : "Leave empty for random puns, or be specific for targeted wordplay!"
                        }
                      </p>
                    </div>
                  )}
                  
                  
                  <div className="flex gap-4 justify-center">
                    {currentCategory === 'riddles' ? (
                      <button 
                        onClick={generateRiddles}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Generating...
                          </div>
                        ) : (
                          `Generate Fun Riddles 🧩`
                        )}
                      </button>
                    ) : currentCategory === 'stories' ? (
                      <button 
                        onClick={generateStory}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Generating...
                          </div>
                        ) : (
                          'Generate Story 📚'
                        )}
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={currentCategory === 'roasts' ? generateRoast : generatePuns}
                          disabled={isLoading}
                          className={`bg-gradient-to-r ${
                            currentCategory === 'roasts' 
                              ? 'from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                              : 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Generating...
                            </div>
                          ) : (
                            currentCategory === 'roasts' ? 'Generate Roast 🔥' : 'Generate Puns ✨'
                          )}
                        </button>
                        
                        <button 
                          onClick={currentCategory === 'roasts' ? generateRandomRoast : generateRandomPuns}
                          disabled={isLoading}
                          className={`bg-gradient-to-r ${
                            currentCategory === 'roasts' 
                              ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                              : 'from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Random...
                            </div>
                          ) : (
                            currentCategory === 'roasts' ? 'Random Roast 🎲' : 'Random Puns 🎲'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {roastContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-600 rounded-2xl p-6"
                  >
                    <div className="text-center">
                      <div className={`text-sm font-bold mb-6 tracking-wider ${
                        currentCategory === 'roasts' ? 'text-red-400' : 
                        currentCategory === 'puns' ? 'text-yellow-400' :
                        currentCategory === 'stories' ? 'text-green-400' :
                        'text-blue-400'
                      }`}>
                        {currentCategory === 'roasts' ? '🔥 ROASTS INCOMING 🔥' : 
                         currentCategory === 'puns' ? '✨ PUNS INCOMING ✨' :
                         currentCategory === 'stories' ? '📚 STORY INCOMING 📚' :
                         '🧠 RIDDLES INCOMING 🧠'}
                      </div>
                      <div className="text-white text-lg leading-relaxed space-y-4">
                        {currentCategory === 'riddles' ? (
                          // Special handling for riddles - cleaner UI
                          (() => {
                            const riddles = parseRiddleContent(roastContent)
                            return (
                              <div className="space-y-6">
                                {riddles.map((riddleData, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-slate-800 rounded-2xl border border-slate-600 overflow-hidden"
                                  >
                                    {/* Riddle Question */}
                                    <div className="p-6">
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                          <span className="text-white font-bold text-sm">{index + 1}</span>
                                        </div>
                                        <h3 className="text-blue-400 font-semibold text-lg">Riddle</h3>
                                      </div>
                                      <p className="text-white text-lg leading-relaxed mb-6">{riddleData.riddle}</p>
                                      
                                      {/* Answer Button */}
                                      <div className="flex justify-center">
                                        <button
                                          onClick={() => toggleAnswer(index)}
                                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                          {showAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Answer Section */}
                                    {showAnswers[index] && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-green-900/20 border-t border-green-600/30 p-6"
                                      >
                                        <div className="flex items-center gap-3 mb-3">
                                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">💡</span>
                                          </div>
                                          <h3 className="text-green-400 font-semibold text-lg">Answer</h3>
                                        </div>
                                        <p className="text-green-300 text-lg leading-relaxed">{riddleData.answer}</p>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            )
                          })()
                        ) : (
                          // Regular handling for roasts and puns
                          roastContent.split('\n').map((roast, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-slate-700 rounded-xl border border-slate-600 hover:bg-slate-600 transition-colors duration-300"
                            >
                              {roast}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                  <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
                    currentCategory === 'roasts' 
                      ? 'border-red-500/30 border-t-red-500' 
                      : currentCategory === 'puns'
                      ? 'border-yellow-500/30 border-t-yellow-500'
                      : 'border-blue-500/30 border-t-blue-500'
                  }`}></div>
                  <p className="text-slate-300">
                    {currentCategory === 'roasts' 
                      ? 'Crafting 5 perfect roasts...' 
                      : currentCategory === 'puns'
                      ? 'Crafting 5 perfect puns...'
                      : `Crafting 5 fun riddles...`
                    }
                  </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}