export type Question = {
  id: number;
  q: string;
  options: string[];
  answer: number;
};

export const juniorQuestions: Question[] = [
  { id: 1, q: "23 + 15 = ?\n\n23 + 15 = ?", options: ["38", "37", "48", "28"], answer: 0 },

  { id: 2, q: "46 + 22 = ?\n\n46 + 22 = ?", options: ["68", "72", "66", "58"], answer: 0 },

  { id: 3, q: "34 + 11 = ?\n\n34 + 11 = ?", options: ["45", "44", "54", "35"], answer: 0 },

  { id: 4, q: "57 + 13 = ?\n\n57 + 13 = ?", options: ["60", "70", "80", "68"], answer: 1 },

  { id: 5, q: "29 + 30 = ?\n\n29 + 30 = ?", options: ["59", "69", "49", "39"], answer: 0 },

  { id: 6, q: "18 + 27 = ?\n\n18 + 27 = ?", options: ["35", "45", "55", "65"], answer: 1 },

  { id: 7, q: "64 + 16 = ?\n\n64 + 16 = ?", options: ["70", "80", "90", "60"], answer: 1 },

  { id: 8, q: "41 + 19 = ?\n\n41 + 19 = ?", options: ["50", "60", "70", "80"], answer: 1 },

  { id: 9, q: "50 - 23 = ?\n\n50 - 23 = ?", options: ["27", "37", "17", "47"], answer: 0 },

  { id: 10, q: "80 - 35 = ?\n\n80 - 35 = ?", options: ["45", "55", "65", "35"], answer: 0 },

  { id: 11, q: "67 - 22 = ?\n\n67 - 22 = ?", options: ["45", "55", "35", "25"], answer: 0 },

  { id: 12, q: "90 - 40 = ?\n\n90 - 40 = ?", options: ["60", "50", "40", "30"], answer: 1 },

  { id: 13, q: "72 - 18 = ?\n\n72 - 18 = ?", options: ["54", "64", "44", "34"], answer: 0 },

  { id: 14, q: "55 - 27 = ?\n\n55 - 27 = ?", options: ["28", "38", "18", "48"], answer: 0 },

  { id: 15, q: "100 - 45 = ?\n\n100 - 45 = ?", options: ["65", "55", "45", "35"], answer: 1 },

  { id: 16, q: "39 - 12 = ?\n\n39 - 12 = ?", options: ["27", "17", "37", "47"], answer: 0 },

  { id: 17, q: "Ali has 12 apples. He buys 8 more. How many apples now?\n\nஅலியிடம் 12 ஆப்பிள்கள் உள்ளன. அவர் மேலும் 8 ஆப்பிள்கள் வாங்கினார். இப்போது அவரிடம் எத்தனை ஆப்பிள்கள் உள்ளன?", options: ["18", "20", "22", "24"], answer: 1 },

  { id: 18, q: "There are 25 students in a class. 10 leave. How many remain?\n\nஒரு வகுப்பில் 25 மாணவர்கள் உள்ளனர். 10 பேர் வெளியேறினர். எத்தனை பேர் மீதமிருக்கின்றனர்?", options: ["15", "10", "20", "5"], answer: 0 },

  { id: 19, q: "Sara has 30 stickers. She gives 5 to her friend. How many are left?\n\nசாராவிடம் 30 ஸ்டிக்கர்கள் உள்ளன. அவர் தனது நண்பருக்கு 5 கொடுத்தார். எத்தனை மீதமுள்ளது?", options: ["20", "25", "15", "10"], answer: 1 },

  { id: 20, q: "A shop has 40 balloons. 12 burst. How many are left?\n\nஒரு கடையில் 40 பலூன்கள் உள்ளன. 12 பலூன்கள் வெடித்தன. எத்தனை மீதமுள்ளது?", options: ["18", "28", "38", "30"], answer: 1 },

  { id: 21, q: "There are 15 boys and 14 girls. How many students are there altogether?\n\n15 ஆண் மாணவர்களும் 14 பெண் மாணவர்களும் உள்ளனர். மொத்தம் எத்தனை மாணவர்கள் உள்ளனர்?", options: ["29", "30", "28", "27"], answer: 0 },

  { id: 22, q: "John had 50 cents. He spent 20 cents. How much money is left?\n\nஜானிடம் 50 சென்ட் இருந்தது. அவர் 20 சென்ட் செலவிட்டார். எவ்வளவு மீதமுள்ளது?", options: ["40", "30", "20", "10"], answer: 1 },

  { id: 23, q: "What is the value of 7 in 75?\n\n75 என்ற எண்ணில் 7 இன் மதிப்பு என்ன?", options: ["70", "7", "75", "5"], answer: 0 },

  { id: 24, q: "In 63, what is the tens digit?\n\n63 என்ற எண்ணில் பத்துகள் இலக்கம் எது?", options: ["3", "6", "60", "63"], answer: 1 },

  { id: 25, q: "Which number is bigger?\n\nஎந்த எண் பெரியது?", options: ["45", "54", "40", "44"], answer: 1 },

  { id: 26, q: "Which number is smallest?\n\nமிகச் சிறிய எண் எது?", options: ["67", "76", "60", "69"], answer: 2 },

  { id: 27, q: "32 ___ 23\n\n32 ___ 23", options: [">", "<", "=", "≠"], answer: 0 },

  { id: 28, q: "88 is ___ 78\n\n88 என்பது 78 ஐ விட ___", options: ["less than", "greater than", "equal to", "not related"], answer: 1 },

  { id: 29, q: "Arrange in ascending order: 12, 5, 9\n\n12, 5, 9 ஆகியவற்றை ஏறுவரிசையில் அமைக்கவும்.", options: ["5, 9, 12", "12, 9, 5", "9, 5, 12", "5, 12, 9"], answer: 0 },

  { id: 30, q: "Arrange in descending order: 34, 21, 45\n\n34, 21, 45 ஆகியவற்றை இறங்குவரிசையில் அமைக்கவும்.", options: ["21, 34, 45", "45, 34, 21", "34, 45, 21", "45, 21, 34"], answer: 1 },

  { id: 31, q: "Which comes first in ascending order?\n\nஏறுவரிசையில் முதலில் வரும் எண் எது?", options: ["90", "12", "55", "40"], answer: 1 },

  { id: 32, q: "2, 4, 6, __\n\n2, 4, 6, __", options: ["7", "8", "10", "12"], answer: 1 },

  { id: 33, q: "5, 10, 15, __\n\n5, 10, 15, __", options: ["25", "30", "20", "15"], answer: 2 },

  { id: 34, q: "1, 3, 5, __\n\n1, 3, 5, __", options: ["6", "7", "8", "9"], answer: 1 },

  { id: 35, q: "RM1 + 50 sen = ?\n\nRM1 + 50 சென் = ?", options: ["RM1.50", "RM2.00", "RM1.20", "RM0.50"], answer: 0 },

  { id: 36, q: "You have RM5. You buy an item for RM3. How much is left?\n\nஉங்களிடம் RM5 உள்ளது. RM3 மதிப்புள்ள பொருளை வாங்கினால் எவ்வளவு மீதமிருக்கும்?", options: ["RM1", "RM2", "RM3", "RM4"], answer: 1 },

  { id: 37, q: "What time is 3 hours after 2 o'clock?\n\n2 மணிக்குப் பிறகு 3 மணி நேரம் கழித்து நேரம் என்ன?", options: ["4 o'clock", "5 o'clock", "6 o'clock", "7 o'clock"], answer: 1 },

  { id: 38, q: "Which shows 1/2?\n\n1/2 ஐ குறிக்கும் விடை எது?", options: ["1 out of 4", "1 out of 2", "2 out of 3", "3 out of 4"], answer: 1 },

  { id: 39, q: "1/4 means:\n\n1/4 என்பது:", options: ["one part of 2", "one part of 3", "one part of 4", "four parts"], answer: 2 },

  { id: 40, q: "Which fraction is bigger?\n\nஎந்த பின்னம் பெரியது?", options: ["1/2", "1/4", "1/3", "1/5"], answer: 0 }
];

export const seniorQuestions: Question[] = [
  { id: 1, q: "What is the value of digit 8 in 58,421?\n\n58,421 என்ற எண்ணில் 8 இன் மதிப்பு என்ன?", options: ["8", "80", "800", "8,000"], answer: 3 },

  { id: 2, q: "Which number is the smallest?\n\nமிகச் சிறிய எண் எது?", options: ["72,509", "72,590", "72,095", "72,950"], answer: 2 },

  { id: 3, q: "Round 46,782 to the nearest thousand.\n\n46,782 ஐ அருகிலுள்ள ஆயிரத்திற்கு முழுமையாக்குக.", options: ["46,000", "47,000", "46,800", "48,000"], answer: 1 },

  { id: 4, q: "27,485 + 15,629 = ?\n\n27,485 + 15,629 = ?", options: ["43,104", "42,114", "43,114", "42,104"], answer: 2 },

  { id: 5, q: "84,903 - 27,586 = ?\n\n84,903 - 27,586 = ?", options: ["57,317", "57,417", "58,317", "56,317"], answer: 0 },

  { id: 6, q: "216 × 14 = ?\n\n216 × 14 = ?", options: ["3,014", "3,024", "3,034", "3,044"], answer: 1 },

  { id: 7, q: "7,560 ÷ 18 = ?\n\n7,560 ÷ 18 = ?", options: ["410", "420", "430", "440"], answer: 1 },

  { id: 8, q: "25 × 36 = ?\n\n25 × 36 = ?", options: ["850", "875", "900", "925"], answer: 2 },

  { id: 9, q: "Find the next number: 145, 155, 165, 175, _____\n\nஅடுத்த எண்ணைக் கண்டுபிடிக்கவும்: 145, 155, 165, 175, _____", options: ["180", "185", "190", "195"], answer: 1 },

  { id: 10, q: "Which number is even?\n\nகீழ்க்கண்ட எண்களில் இரட்டை எண் எது?", options: ["67,891", "45,213", "72,846", "91,305"], answer: 2 },

  { id: 11, q: "3/4 of 320 = ?\n\n320 இன் 3/4 = ?", options: ["220", "230", "240", "250"], answer: 2 },

  { id: 12, q: "5/8 of 400 = ?\n\n400 இன் 5/8 = ?", options: ["200", "250", "300", "350"], answer: 1 },

  { id: 13, q: "18.45 + 7.8 = ?\n\n18.45 + 7.8 = ?", options: ["25.25", "26.25", "27.25", "28.25"], answer: 1 },

  { id: 14, q: "50 - 16.75 = ?\n\n50 - 16.75 = ?", options: ["33.25", "34.25", "35.25", "36.25"], answer: 0 },

  { id: 15, q: "40% of 250 = ?\n\n250 இன் 40% = ?", options: ["80", "90", "100", "110"], answer: 2 },

  { id: 16, q: "25% of 720 = ?\n\n720 இன் 25% = ?", options: ["170", "180", "190", "200"], answer: 1 },

  { id: 17, q: "Convert 4.5 km to metres.\n\n4.5 கிலோமீட்டரை மீட்டராக மாற்றுக.", options: ["450", "4,500", "45,000", "450,000"], answer: 1 },

  { id: 18, q: "Perimeter of a square with side length 14 cm is\n\n14 செமீ பக்க நீளமுள்ள சதுரத்தின் சுற்றளவு என்ன?", options: ["48 cm", "52 cm", "56 cm", "60 cm"], answer: 2 },

  { id: 19, q: "Area of a rectangle measuring 13 cm × 7 cm is\n\n13 செமீ × 7 செமீ செவ்வகத்தின் பரப்பளவு என்ன?", options: ["81 cm²", "91 cm²", "101 cm²", "111 cm²"], answer: 1 },

  { id: 20, q: "Point (6,4) means\n\n(6,4) என்ற புள்ளி குறிக்கும் பொருள் என்ன?", options: ["6 right, 4 up", "4 right, 6 up", "6 left, 4 up", "4 left, 6 up"], answer: 0 },

  { id: 21, q: "A school has 15,875 books. It received another 4,325 books. How many books are there now?\n\nஒரு பள்ளியில் 15,875 புத்தகங்கள் உள்ளன. மேலும் 4,325 புத்தகங்கள் கிடைத்தன. இப்போது மொத்தம் எத்தனை புத்தகங்கள் உள்ளன?", options: ["20,100", "20,200", "20,300", "20,400"], answer: 1 },

  { id: 22, q: "A factory produced 72,500 bottles. It sold 38,750 bottles. How many bottles are left?\n\nஒரு தொழிற்சாலை 72,500 பாட்டில்களை உற்பத்தி செய்தது. அதில் 38,750 பாட்டில்கள் விற்கப்பட்டன. எத்தனை பாட்டில்கள் மீதமுள்ளது?", options: ["33,650", "33,750", "34,650", "34,750"], answer: 1 },

  { id: 23, q: "A bus carries 45 passengers. How many passengers can 16 buses carry altogether?\n\nஒரு பேருந்து 45 பயணிகளை ஏற்றும். 16 பேருந்துகள் மொத்தம் எத்தனை பயணிகளை ஏற்றும்?", options: ["700", "710", "720", "730"], answer: 2 },

  { id: 24, q: "A baker packed 540 cupcakes equally into 18 boxes. How many cupcakes were in each box?\n\n540 கேக்குகள் 18 பெட்டிகளில் சமமாக அடுக்கப்பட்டன. ஒவ்வொரு பெட்டியிலும் எத்தனை கேக்குகள் இருந்தன?", options: ["25", "30", "35", "40"], answer: 1 },

  { id: 25, q: "Ali saves RM35 every week. How much does he save in 8 weeks?\n\nஅலி ஒவ்வொரு வாரமும் RM35 சேமிக்கிறார். 8 வாரங்களில் எவ்வளவு சேமிப்பார்?", options: ["RM260", "RM270", "RM280", "RM290"], answer: 2 },

  { id: 26, q: "A water tank contains 950 litres of water. 375 litres are used. How much water remains?\n\nஒரு தண்ணீர் தொட்டியில் 950 லிட்டர் தண்ணீர் உள்ளது. 375 லிட்டர் பயன்படுத்தப்பட்டது. எவ்வளவு தண்ணீர் மீதமுள்ளது?", options: ["565 L", "575 L", "585 L", "595 L"], answer: 1 },

  { id: 27, q: "A school has 640 students. Three-quarters of them joined Sports Day. How many students joined?\n\nஒரு பள்ளியில் 640 மாணவர்கள் உள்ளனர். அவர்களில் முக்கால்வாசி விளையாட்டு நாளில் கலந்து கொண்டனர். எத்தனை மாணவர்கள் கலந்து கொண்டனர்?", options: ["460", "470", "480", "490"], answer: 2 },

  { id: 28, q: "Siti scored 72 marks. Her brother scored 25% more than her. What was his score?\n\nசித்தி 72 மதிப்பெண்கள் பெற்றார். அவரது சகோதரர் அவரைவிட 25% அதிகமாக பெற்றார். அவர் பெற்ற மதிப்பெண் என்ன?", options: ["80", "85", "90", "95"], answer: 2 },

  { id: 29, q: "A movie starts at 9:25 a.m. and ends at 11:10 a.m. What is the duration?\n\nஒரு திரைப்படம் காலை 9:25க்கு தொடங்கி 11:10க்கு முடிகிறது. அதன் கால அளவு என்ன?", options: ["1 h 35 min", "1 h 45 min", "1 h 55 min", "2 h"], answer: 1 },

  { id: 30, q: "A train travelled 185 km in the morning and 215 km in the afternoon. What was the total distance travelled?\n\nஒரு ரயில் காலை 185 கிமீ மற்றும் மதியம் 215 கிமீ பயணித்தது. மொத்தமாக எத்தனை கிலோமீட்டர் பயணித்தது?", options: ["350 km", "375 km", "400 km", "425 km"], answer: 2 },

  { id: 31, q: "The area of a rectangle is 96 cm². Its width is 8 cm. What is its length?\n\nஒரு செவ்வகத்தின் பரப்பளவு 96 செமீ². அதன் அகலம் 8 செமீ. அதன் நீளம் என்ன?", options: ["10 cm", "11 cm", "12 cm", "13 cm"], answer: 2 },

  { id: 32, q: "The perimeter of a square is 72 cm. What is the area of the square?\n\nஒரு சதுரத்தின் சுற்றளவு 72 செமீ. அதன் பரப்பளவு என்ன?", options: ["304 cm²", "314 cm²", "324 cm²", "334 cm²"], answer: 2 },

  { id: 33, q: "A carton contains 24 bottles. How many bottles are there in 25 cartons?\n\nஒரு பெட்டியில் 24 பாட்டில்கள் உள்ளன. 25 பெட்டிகளில் மொத்தம் எத்தனை பாட்டில்கள் இருக்கும்?", options: ["500", "550", "600", "650"], answer: 2 },

  { id: 34, q: "There are 48 boys and 32 girls in a club. What fraction of the members are girls?\n\nஒரு கழகத்தில் 48 ஆண்களும் 32 பெண்களும் உள்ளனர். உறுப்பினர்களில் பெண்களின் பின்னம் என்ன?", options: ["2/5", "3/5", "4/5", "1/2"], answer: 0 },

  { id: 35, q: "A number is multiplied by 8 and the answer is 384. What is the number?\n\nஒரு எண் 8 ஆல் பெருக்கப்பட்டதில் விடை 384. அந்த எண் என்ன?", options: ["46", "47", "48", "49"], answer: 2 },

  { id: 36, q: "The sum of two numbers is 95. One number is 37. What is the other number?\n\nஇரண்டு எண்களின் கூட்டுத்தொகை 95. ஒரு எண் 37 என்றால் மற்ற எண் என்ன?", options: ["56", "57", "58", "59"], answer: 2 },

  { id: 37, q: "A number pattern increases by 15 each time.\n120, 135, 150, 165, _____\n\nஒரு எண் வரிசை ஒவ்வொரு முறையும் 15 அதிகரிக்கிறது.\n120, 135, 150, 165, _____", options: ["170", "175", "180", "185"], answer: 2 },

  { id: 38, q: "When a number is rounded to the nearest thousand, it becomes 48,000. Which of the following could be the number?\n\nஒரு எண் அருகிலுள்ள ஆயிரத்திற்கு முழுமையாக்கப்பட்டபோது 48,000 ஆகிறது. கீழ்க்கண்டவற்றில் எது அந்த எண்ணாக இருக்கலாம்?", options: ["47,420", "47,499", "48,620", "49,501"], answer: 2 },

  { id: 39, q: "Three children share 144 stickers equally. Then each child gives away 12 stickers. How many stickers do they have altogether now?\n\nமூன்று குழந்தைகள் 144 ஸ்டிக்கர்களை சமமாகப் பகிர்ந்துகொண்டனர். பின்னர் ஒவ்வொருவரும் 12 ஸ்டிக்கர்கள் கொடுத்தனர். இப்போது மொத்தம் எத்தனை ஸ்டிக்கர்கள் உள்ளன?", options: ["96", "108", "120", "132"], answer: 1 },

  { id: 40, q: "A farmer has chickens and goats. There are 20 animals altogether. The animals have 56 legs altogether. How many goats are there?\n\nஒரு விவசாயியிடம் கோழிகளும் ஆடுகளும் உள்ளன. மொத்தம் 20 விலங்குகள் உள்ளன. அவற்றிற்கு மொத்தம் 56 கால்கள் உள்ளன. எத்தனை ஆடுகள் உள்ளன?", options: ["6", "7", "8", "9"], answer: 2 }
];

export function getQuestionsForCategory(category: "junior" | "senior"): Question[] {
  return category === "junior" ? juniorQuestions : seniorQuestions;
}

export const QUIZ_DURATION_SECONDS = 60 * 60;
