/* Indicative directory carried forward from v2. Verify each programme directly. */
const SCHOOLS = [
  {
    "n": "Școala de Coaching Pleiade (Pleiade Education System)",
    "city": "București / online",
    "url": "https://scoalapleiade.ro/",
    "icf": [
      "L1",
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Centrul de Excelență Leader Coach",
    "city": "București / online",
    "url": "https://leadercoach.ro/",
    "icf": [
      "L1",
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Coaching Partners",
    "city": "București",
    "url": "https://www.coachingpartners.ro/",
    "icf": [
      "L2",
      "AATC",
      "CCE"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "One 2 Coach",
    "city": "România / online",
    "url": "https://www.one2coach.com/",
    "icf": [
      "L1",
      "L2",
      "AATC"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Mind Learners",
    "city": "București / online",
    "url": "https://www.mindlearners.ro/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "CoachingDipity",
    "city": "România / online",
    "url": "https://coachingdipity.ro/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "GROW Yourself Space (WeGrow Academy)",
    "city": "România / online",
    "url": "https://wegrow.academy/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Ethys Scientific",
    "city": "România / online",
    "url": "https://ethys.ro/",
    "icf": [
      "L1"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Erickson Coaching România (prin C-Team Group)",
    "city": "România / online",
    "url": "https://www.cteamgroup.ro/en/erickson-coaching/",
    "icf": [
      "L1",
      "L2",
      "L3"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Metasysteme Coaching (Alain Cardon)",
    "city": "Internațional (livrări în RO/EN)",
    "url": "https://www.metasysteme-coaching.eu/english/",
    "icf": [
      "L2",
      "AATC"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "SolutionsAcademy (Kirsten Dierolf)",
    "city": "Germania / online (RO)",
    "url": "https://www.solutionsacademy.com/ro/home",
    "icf": [
      "L1",
      "L2",
      "L3",
      "AATC"
    ],
    "emcc": [
      "EQA",
      "TCQA",
      "ESQA"
    ],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "TPC Leadership",
    "city": "Internațional (livrare RO)",
    "url": "https://www.tpcleadership.com/",
    "icf": [
      "L1"
    ],
    "emcc": [
      "EQA"
    ],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "CoachVille (Center for Coaching Mastery)",
    "city": "Internațional / online (RO)",
    "url": "https://coachville.com/",
    "icf": [
      "L1",
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Elite Coaching Center",
    "city": "Internațional / online (RO)",
    "url": "https://elitecoachingcenter.com/",
    "icf": [
      "L1"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Radiant Coaches Academy",
    "city": "Internațional / online (RO)",
    "url": "https://www.radiantcoachesacademy.com/",
    "icf": [
      "L1",
      "L2",
      "L3"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "SolutionSurfers",
    "city": "Elveția / online (RO)",
    "url": "https://www.solutionsurfers.com/",
    "icf": [
      "L1",
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Academy of Executive Coaching (AoEC)",
    "city": "Marea Britanie / online (RO)",
    "url": "https://www.aoec.com/",
    "icf": [
      "L2"
    ],
    "emcc": [
      "EQA"
    ],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Coach Masters Academy",
    "city": "Internațional / online (RO)",
    "url": "https://www.coachmastersacademy.com/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Center for Executive Coaching (Keystone)",
    "city": "SUA / online (RO)",
    "url": "https://centerforexecutivecoaching.com/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Coaching and Leadership International",
    "city": "Internațional / online (RO)",
    "url": "https://www.coachingandleadership.com/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Success Unlimited Network (SUN)",
    "city": "Internațional / online (RO)",
    "url": "http://www.successunlimitednet.com/",
    "icf": [
      "L2"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Mind Architect",
    "city": "București / online",
    "url": "https://www.mindarchitect.ro/",
    "icf": [
      "CCE"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Ada Chindea Coaching",
    "city": "România / online",
    "url": "https://adachindea.ro/",
    "icf": [
      "CCE"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Clutterbuck Coaching & Mentoring Intl.",
    "city": "Internațional (RO)",
    "url": "https://clutterbuck-cmi.com/",
    "icf": [
      "CCE"
    ],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": false
  },
  {
    "n": "Bright Goals (Anca Al Kebsi)",
    "city": "România / online",
    "url": "https://brightgoals.ro/curs-coaching/",
    "icf": [
      "L1"
    ],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": true
  },
  {
    "n": "EXEC-EDU — divizia Coaching",
    "city": "București / online",
    "url": "https://exec-edu.ro/",
    "icf": [],
    "emcc": [],
    "anc": false,
    "ro": true,
    "claim": true
  },
  {
    "n": "Universitatea Româno-Americană",
    "city": "București",
    "url": "https://www.rau.ro/program-de-formare-specializare-pentru-ocupatia-specialist-in-activitatea-de-coaching-2/",
    "icf": [],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": false
  },
  {
    "n": "Magic Coaching",
    "city": "România / online",
    "url": "https://magic-coaching.ro/curs-coaching-acreditat-anc/",
    "icf": [],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": false
  },
  {
    "n": "Soft Skills Training (traininguri.ro)",
    "city": "București / online",
    "url": "https://www.traininguri.ro/curs-coaching/",
    "icf": [],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": false
  },
  {
    "n": "AMA Leadership Academy",
    "city": "România / online",
    "url": "https://leadershipacademy.ro/amazing-life-coaching-certification/",
    "icf": [],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": false
  },
  {
    "n": "BestCor / Eurodeal / Centrul Athena",
    "city": "Național / online",
    "url": "https://bestcor.ro/curs-specialist-in-activitatea-de-coaching/",
    "icf": [],
    "emcc": [],
    "anc": true,
    "ro": true,
    "claim": false
  }
];
