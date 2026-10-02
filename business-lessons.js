/* ---------- Business English lessons ---------- */

// The first 10 core lessons, copied from the "Sound Steps: First 10 Video
// Scripts" doc in the order of the Video Category Map. Core lessons have no
// industry, so they show under every industry filter.
//
// Each lesson plays a short video (the scene), then the trainer asks 2-3
// questions. For each question the learner only sees a keyword note (plus a
// sentence starter at Starter level), records their own spoken answer, then
// compares it with the trainer's model answer.
//
// `video` follows the map's naming scheme (umbrella_industry_topic_level.mp4).
// None of the videos exist yet: when the file is missing the player falls
// back to a placeholder that reads the scene's dialogue aloud instead.
const BUSINESS_LESSONS = [
  {
    "id": "opening-a-meeting-politely",
    "title": "Opening a meeting politely",
    "umbrella": "meetings",
    "level": "Starter",
    "skills": [
      "Speaking"
    ],
    "video": "videos/meetings_core_opening-a-meeting-politely_starter.mp4",
    "scene": {
      "seconds": 30,
      "setup": "Five colleagues join a video call. Maria is chairing.",
      "lines": [
        {
          "speaker": "Maria",
          "text": "Good morning, everyone, and thanks for joining. Can everyone hear me okay?"
        },
        {
          "speaker": "James",
          "text": "Yes, loud and clear."
        },
        {
          "speaker": "Maria",
          "text": "Great. The purpose of today's meeting is to agree on the launch date. We have three items on the agenda and about 30 minutes. Let's get started."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "Thanks for joining.",
        "use": "Welcome people."
      },
      {
        "text": "The purpose of today's meeting is to...",
        "use": "Say why you are meeting."
      },
      {
        "text": "We have three items on the agenda.",
        "use": "Show the plan."
      },
      {
        "text": "We have about 30 minutes.",
        "use": "Set the time."
      },
      {
        "text": "Let's get started.",
        "use": "Begin."
      }
    ],
    "tip": null,
    "words": "Agenda, chair, attendees, minutes (the written notes of a meeting).",
    "practiceNote": null,
    "questions": [
      {
        "ask": "You're chairing the budget meeting. Welcome everyone and say why you're meeting.",
        "keywords": [
          "thanks",
          "joining",
          "purpose",
          "next month's budget"
        ],
        "starter": "Thanks for...",
        "model": "Good morning, and thanks for joining. The purpose of today's meeting is to agree on next month's budget."
      },
      {
        "ask": "Now tell them the plan and the time.",
        "keywords": [
          "three items",
          "agenda",
          "45 minutes",
          "get started"
        ],
        "starter": "We have...",
        "model": "We have three items on the agenda and about 45 minutes. Let's get started."
      }
    ]
  },
  {
    "id": "disagreeing-without-sounding-rude",
    "title": "Disagreeing without sounding rude",
    "umbrella": "meetings",
    "level": "Confident",
    "skills": [
      "Speaking"
    ],
    "video": "videos/meetings_core_disagreeing-without-sounding-rude_confident.mp4",
    "scene": {
      "seconds": 35,
      "setup": "A team is planning a product launch.",
      "lines": [
        {
          "speaker": "David",
          "text": "I think we should launch in March. That gives us plenty of time."
        },
        {
          "speaker": "Aisha",
          "text": "I see your point, David, but I'm not sure March works. Our biggest client orders in February. What if we aimed for late January instead?"
        },
        {
          "speaker": "David",
          "text": "That's a fair point. Could we manage it in time?"
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "I see your point, but...",
        "use": "Show respect, then disagree."
      },
      {
        "text": "I'm not sure that works because...",
        "use": "Disagree softly and give a reason."
      },
      {
        "text": "What if we...?",
        "use": "Offer another idea."
      },
      {
        "text": "I have a slightly different view.",
        "use": "Signal a different opinion."
      },
      {
        "text": "That's a fair point.",
        "use": "Accept someone else's argument."
      }
    ],
    "tip": "avoid \"You're wrong\" or \"No, that's bad.\" Disagree with the idea, not the person.",
    "words": "Concern, alternative, trade-off, consensus.",
    "practiceNote": null,
    "questions": [
      {
        "ask": "I think we should cut the training budget by half.",
        "keywords": [
          "see your point",
          "not sure",
          "new staff",
          "need training"
        ],
        "starter": null,
        "model": "I see your point, but I'm not sure that works. We have five new staff, and they really need training."
      },
      {
        "ask": "So what do you suggest instead?",
        "keywords": [
          "what if",
          "online courses",
          "cheaper",
          "same result"
        ],
        "starter": null,
        "model": "What if we used online courses instead? They're cheaper, and we'd get the same result."
      },
      {
        "ask": "Hmm, I'm not convinced online courses work.",
        "keywords": [
          "fair point",
          "try",
          "one team",
          "three months"
        ],
        "starter": null,
        "model": "That's a fair point. Could we try it with one team for three months and then decide?"
      }
    ]
  },
  {
    "id": "summarizing-action-items",
    "title": "Summarizing action items",
    "umbrella": "meetings",
    "level": "Starter",
    "skills": [
      "Speaking"
    ],
    "video": "videos/meetings_core_summarizing-action-items_starter.mp4",
    "scene": {
      "seconds": 30,
      "setup": "The meeting is ending. Maria closes it.",
      "lines": [
        {
          "speaker": "Maria",
          "text": "Before we finish, let me summarize what we agreed. James will send the report to the client by Friday. Aisha will book the venue this week. And I'll update the budget. Does that sound right to everyone?"
        },
        {
          "speaker": "James",
          "text": "Yes, that's clear."
        },
        {
          "speaker": "Maria",
          "text": "Great. Thanks, everyone. Let's meet again next Tuesday."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "Let me summarize what we agreed.",
        "use": "Start the summary."
      },
      {
        "text": "[Name] will [task] by [day].",
        "use": "Say who does what, and when."
      },
      {
        "text": "Does that sound right to everyone?",
        "use": "Check agreement."
      },
      {
        "text": "Let's meet again on...",
        "use": "Set the next meeting."
      },
      {
        "text": "Thanks, everyone.",
        "use": "Close politely."
      }
    ],
    "tip": null,
    "words": "Action item, deadline, owner, follow-up.",
    "practiceNote": null,
    "questions": [
      {
        "ask": "The meeting is ending. Summarize who does what.",
        "keywords": [
          "summarize",
          "Ana: price list, Thursday",
          "Tom: call supplier, tomorrow"
        ],
        "starter": "Let me summarize...",
        "model": "Let me summarize what we agreed. Ana will send the price list by Thursday, and Tom will call the supplier tomorrow."
      },
      {
        "ask": "Check that everyone agrees and close the meeting.",
        "keywords": [
          "sound right",
          "thanks",
          "meet again",
          "next Monday"
        ],
        "starter": "Does that...",
        "model": "Does that sound right to everyone? Great, thanks, everyone. Let's meet again next Monday."
      }
    ]
  },
  {
    "id": "explaining-your-project-in-60-seconds",
    "title": "Explaining your project in 60 seconds",
    "umbrella": "pitching",
    "level": "Confident",
    "skills": [
      "Speaking"
    ],
    "video": "videos/pitching_core_explaining-your-project-in-60-seconds_confident.mp4",
    "scene": {
      "seconds": 45,
      "setup": "At a networking event, a funder asks Grace, \"So, what do you work on?\"",
      "lines": [
        {
          "speaker": "Grace",
          "text": "We help small farmers sell directly to restaurants. Right now, farmers lose about 30% of their income to middlemen. Our app connects them straight to buyers. So far, we've worked with 40 farms, and their income has gone up by 20%. Next, we want to reach 200 farms across the region."
        }
      ]
    },
    "phrasesIntro": "Use this four-step pattern:",
    "phrases": [
      {
        "text": "We help [who] to [do what].",
        "use": "The mission."
      },
      {
        "text": "Right now, [problem].",
        "use": "The problem."
      },
      {
        "text": "Our [product or service] [solves it how].",
        "use": "The solution."
      },
      {
        "text": "So far, we've... Next, we want to...",
        "use": "Results and goal."
      }
    ],
    "tip": "use one number in each step if you can. Numbers make people remember you.",
    "words": "Mission, target group, traction, scale.",
    "practiceNote": "Learners can swap in their own project, using the same four steps.",
    "questions": [
      {
        "ask": "So, what does your company do?",
        "keywords": [
          "help",
          "small shops",
          "sell online",
          "problem: no website"
        ],
        "starter": null,
        "model": "We help small shops sell online. Right now, most of them don't have a website, so they lose customers."
      },
      {
        "ask": "How do you solve that?",
        "keywords": [
          "simple app",
          "online store",
          "one day"
        ],
        "starter": null,
        "model": "Our app lets them set up an online store in one day."
      },
      {
        "ask": "Interesting. How is it going so far?",
        "keywords": [
          "so far",
          "120 shops",
          "sales up 25%",
          "next: 1,000"
        ],
        "starter": null,
        "model": "So far, we've worked with 120 shops, and their sales went up 25%. Next, we want to reach 1,000 shops."
      }
    ]
  },
  {
    "id": "asking-for-funding",
    "title": "Asking for funding",
    "umbrella": "pitching",
    "level": "Confident",
    "skills": [
      "Speaking"
    ],
    "video": "videos/pitching_core_asking-for-funding_confident.mp4",
    "scene": {
      "seconds": 40,
      "setup": "Grace meets a program officer at a foundation.",
      "lines": [
        {
          "speaker": "Grace",
          "text": "Thank you for meeting with me. As I mentioned, we've already doubled income for 40 farms. We'd like to grow that to 200 farms. To do this, we're requesting $50,000 over 12 months. This would cover training, the app, and two field staff."
        },
        {
          "speaker": "Funder",
          "text": "And how would you measure success?"
        },
        {
          "speaker": "Grace",
          "text": "Good question. We'd track farmer income every quarter and share a report with you."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "We're requesting [amount] over [time].",
        "use": "The clear ask."
      },
      {
        "text": "This would cover...",
        "use": "What the money pays for."
      },
      {
        "text": "With your support, we could...",
        "use": "The result."
      },
      {
        "text": "We'd measure success by...",
        "use": "How you'll show impact."
      },
      {
        "text": "Good question.",
        "use": "Buy a second to think."
      }
    ],
    "tip": "say the number clearly and then stop talking. Don't apologize for asking.",
    "words": "The ask, budget, impact, reporting. (Industry versions change these: \"grant\" for nonprofits, \"seed round\" for startups, \"project financing\" for construction.)",
    "practiceNote": null,
    "questions": [
      {
        "ask": "How much funding do you need, and for how long?",
        "keywords": [
          "requesting",
          "$50,000",
          "12 months"
        ],
        "starter": null,
        "model": "We're requesting $50,000 over 12 months."
      },
      {
        "ask": "What would the money pay for?",
        "keywords": [
          "cover",
          "training",
          "app",
          "two field staff"
        ],
        "starter": null,
        "model": "This would cover training, the app, and two field staff."
      },
      {
        "ask": "How would you measure success?",
        "keywords": [
          "good question",
          "farmer income",
          "every quarter",
          "report"
        ],
        "starter": null,
        "model": "Good question. We'd measure success by tracking farmer income every quarter, and we'd share a report with you."
      }
    ]
  },
  {
    "id": "answering-a-question-you-cant-answer-yet",
    "title": "Answering a question you can't answer yet",
    "umbrella": "pitching",
    "level": "Confident",
    "skills": [
      "Speaking",
      "Listening"
    ],
    "video": "videos/pitching_core_answering-a-question-you-cant-answer-yet_confident.mp4",
    "scene": {
      "seconds": 35,
      "setup": "In the same funding meeting, the funder asks something difficult.",
      "lines": [
        {
          "speaker": "Funder",
          "text": "What will happen when the funding ends? How will the project continue?"
        },
        {
          "speaker": "Grace",
          "text": "That's an important question. We're still working out the details of our long-term plan. Let me check with our finance lead and get back to you by Friday with a clear answer. What I can tell you now is that restaurants already pay a small fee, which covers part of our costs."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "That's an important question.",
        "use": "Show you take it seriously."
      },
      {
        "text": "We're still working out the details.",
        "use": "Be honest."
      },
      {
        "text": "Let me check and get back to you by [day].",
        "use": "Promise a follow-up with a date."
      },
      {
        "text": "What I can tell you now is...",
        "use": "Share what you do know."
      }
    ],
    "tip": "never guess or invent a number. An honest \"I'll get back to you\" builds more trust.",
    "words": "Sustainability, exit plan, follow-up, revenue.",
    "practiceNote": null,
    "questions": [
      {
        "ask": "What will your sales be next year?",
        "keywords": [
          "important question",
          "still working out",
          "check",
          "Friday"
        ],
        "starter": null,
        "model": "That's an important question. We're still working out the numbers. Let me check with our finance team and get back to you by Friday."
      },
      {
        "ask": "Can you give me any idea now?",
        "keywords": [
          "can tell you now",
          "this year",
          "grew 15%"
        ],
        "starter": null,
        "model": "What I can tell you now is that our sales grew 15% this year."
      }
    ]
  },
  {
    "id": "presenting-a-project-proposal",
    "title": "Presenting a project proposal",
    "umbrella": "pitching",
    "level": "Advanced",
    "skills": [
      "Speaking"
    ],
    "video": "videos/pitching_core_presenting-a-project-proposal_advanced.mp4",
    "scene": {
      "seconds": 50,
      "setup": "Omar presents a proposal to the leadership team.",
      "lines": [
        {
          "speaker": "Omar",
          "text": "Today I'd like to propose a new customer support system. First, I'll explain the problem. Then I'll walk you through our solution, the timeline, and the cost."
        },
        {
          "speaker": "Omar",
          "text": "At the moment, customers wait an average of two days for a reply. We propose an online help center. It would take three months to build and cost $20,000. We expect it to cut waiting time by half."
        },
        {
          "speaker": "Omar",
          "text": "To sum up, this is a low-cost way to keep our customers happy. I'd be happy to take any questions."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "Today I'd like to propose...",
        "use": "State the proposal."
      },
      {
        "text": "First... Then... Finally...",
        "use": "Give the structure."
      },
      {
        "text": "At the moment...",
        "use": "Describe the problem."
      },
      {
        "text": "We propose... It would take... and cost...",
        "use": "Solution, time, money."
      },
      {
        "text": "We expect it to...",
        "use": "The benefit."
      },
      {
        "text": "To sum up... I'd be happy to take any questions.",
        "use": "Close and invite questions."
      }
    ],
    "tip": null,
    "words": "Proposal, scope, timeline, deliverables, budget.",
    "practiceNote": "Advanced level: fewer keywords.",
    "questions": [
      {
        "ask": "What would you like to propose?",
        "keywords": [
          "propose",
          "flexible hours"
        ],
        "starter": null,
        "model": "Today I'd like to propose flexible working hours for our team."
      },
      {
        "ask": "Why? What's the problem now?",
        "keywords": [
          "at the moment",
          "traffic",
          "late"
        ],
        "starter": null,
        "model": "At the moment, many staff arrive late because of morning traffic."
      },
      {
        "ask": "What exactly would change, and what's the benefit?",
        "keywords": [
          "start 7 to 10",
          "no cost",
          "expect"
        ],
        "starter": null,
        "model": "We propose that people start any time between 7 and 10. It would cost nothing, and we expect it to reduce late arrivals."
      }
    ]
  },
  {
    "id": "giving-feedback-that-helps",
    "title": "Giving feedback that helps",
    "umbrella": "management",
    "level": "Confident",
    "skills": [
      "Speaking"
    ],
    "video": "videos/management_core_giving-feedback-that-helps_confident.mp4",
    "scene": {
      "seconds": 40,
      "setup": "A manager, Lena, talks to a team member, Sam, after a client presentation.",
      "lines": [
        {
          "speaker": "Lena",
          "text": "Sam, do you have a minute? I wanted to give you some feedback on today's presentation. Your slides were really clear, and the client liked the examples. One thing to work on: you spoke quite fast, so it was hard to follow the numbers. Next time, could you pause after each key figure?"
        },
        {
          "speaker": "Sam",
          "text": "Sure, that makes sense. Thanks."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "Do you have a minute? I wanted to give you some feedback.",
        "use": "Ask first."
      },
      {
        "text": "[Specific thing] was really good.",
        "use": "Start with something real and positive."
      },
      {
        "text": "One thing to work on is...",
        "use": "Name one area, not ten."
      },
      {
        "text": "Next time, could you...?",
        "use": "Give a clear action."
      }
    ],
    "tip": "talk about the action, not the person. Say \"you spoke fast,\" not \"you're bad at presenting.\"",
    "words": "Strengths, area for improvement, development, constructive.",
    "practiceNote": null,
    "questions": [
      {
        "ask": "Your colleague's report was late but very well written. Start the feedback.",
        "keywords": [
          "a minute",
          "feedback",
          "report",
          "clear",
          "well organized"
        ],
        "starter": null,
        "model": "Do you have a minute? I wanted to give you some feedback on the report. It was really clear and well organized."
      },
      {
        "ask": "Now tell them what to improve.",
        "keywords": [
          "one thing",
          "two days late",
          "next time",
          "tell me early"
        ],
        "starter": null,
        "model": "One thing to work on is timing. It arrived two days late. Next time, could you tell me early if you need more time?"
      }
    ]
  },
  {
    "id": "delegating-a-task-clearly",
    "title": "Delegating a task clearly",
    "umbrella": "management",
    "level": "Confident",
    "skills": [
      "Speaking"
    ],
    "video": "videos/management_core_delegating-a-task-clearly_confident.mp4",
    "scene": {
      "seconds": 40,
      "setup": "Lena gives Sam a new task.",
      "lines": [
        {
          "speaker": "Lena",
          "text": "Sam, I'd like you to take the lead on the customer survey. The goal is to find out why some clients didn't renew. Could you send it to 50 clients and share the results by the 15th? You can use the template from last year. If you get stuck, just let me know."
        },
        {
          "speaker": "Sam",
          "text": "Sure. Just to check: should I include clients from the new region?"
        },
        {
          "speaker": "Lena",
          "text": "Good question. Yes, please include them."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "I'd like you to take the lead on...",
        "use": "Give the task."
      },
      {
        "text": "The goal is to...",
        "use": "Explain why."
      },
      {
        "text": "Could you... by [date]?",
        "use": "Say what is needed and when."
      },
      {
        "text": "You can use...",
        "use": "Point to resources."
      },
      {
        "text": "If you get stuck, just let me know.",
        "use": "Offer support."
      }
    ],
    "tip": "always give the reason. People work better when they know why the task matters.",
    "words": "Responsibility, deadline, resources, check in.",
    "practiceNote": null,
    "questions": [
      {
        "ask": "Ask your team member to organize next month's team event.",
        "keywords": [
          "take the lead",
          "team event",
          "goal",
          "get to know new staff"
        ],
        "starter": null,
        "model": "I'd like you to take the lead on next month's team event. The goal is to help everyone get to know our new staff."
      },
      {
        "ask": "Tell them what you need and by when.",
        "keywords": [
          "could you",
          "venue + plan",
          "the 20th",
          "budget $500"
        ],
        "starter": null,
        "model": "Could you book a venue and share a plan by the 20th? You can use a budget of $500."
      },
      {
        "ask": "Close by offering support.",
        "keywords": [
          "stuck",
          "let me know"
        ],
        "starter": null,
        "model": "If you get stuck, just let me know."
      }
    ]
  },
  {
    "id": "running-a-one-to-one",
    "title": "Running a one-to-one",
    "umbrella": "management",
    "level": "Advanced",
    "skills": [
      "Speaking",
      "Listening"
    ],
    "video": "videos/management_core_running-a-one-to-one_advanced.mp4",
    "scene": {
      "seconds": 45,
      "setup": "Lena has her weekly one-to-one meeting with Sam.",
      "lines": [
        {
          "speaker": "Lena",
          "text": "So, how are things going this week?"
        },
        {
          "speaker": "Sam",
          "text": "Mostly fine, but the survey is taking longer than I expected."
        },
        {
          "speaker": "Lena",
          "text": "I see. What's slowing it down?"
        },
        {
          "speaker": "Sam",
          "text": "A lot of clients haven't replied yet."
        },
        {
          "speaker": "Lena",
          "text": "That makes sense. Is there anything I can do to help? I could send a reminder from my email."
        },
        {
          "speaker": "Sam",
          "text": "That would really help, thanks."
        },
        {
          "speaker": "Lena",
          "text": "Great. So, I'll send the reminder today, and you'll share the first results on Monday."
        }
      ]
    },
    "phrasesIntro": null,
    "phrases": [
      {
        "text": "How are things going?",
        "use": "Open the conversation."
      },
      {
        "text": "What's slowing it down?",
        "use": "Ask an open question."
      },
      {
        "text": "That makes sense.",
        "use": "Show you are listening."
      },
      {
        "text": "Is there anything I can do to help?",
        "use": "Offer support."
      },
      {
        "text": "So, I'll... and you'll...",
        "use": "Agree on next steps."
      }
    ],
    "tip": "in a one-to-one, the team member should talk more than the manager. Ask, then listen.",
    "words": "Check-in, priorities, blocker, support, goals.",
    "practiceNote": "Advanced level: fewer keywords.",
    "questions": [
      {
        "ask": "Your team member seems stressed. Open the one-to-one.",
        "keywords": [
          "how",
          "going"
        ],
        "starter": null,
        "model": "So, how are things going this week?"
      },
      {
        "ask": "They say: 'Honestly, I have too much work.' Ask a follow-up question.",
        "keywords": [
          "what",
          "most time"
        ],
        "starter": null,
        "model": "I see. What's taking up most of your time?"
      },
      {
        "ask": "They say: 'The monthly report takes two full days.' Offer help and agree next steps.",
        "keywords": [
          "makes sense",
          "help",
          "I'll",
          "you'll"
        ],
        "starter": null,
        "model": "That makes sense. Is there anything I can do to help? I could ask Sam to do the data part. So, I'll talk to Sam today, and you'll focus on the client work."
      }
    ]
  }
];

// The six setting umbrellas from the Video Category Map, in menu order.
// Umbrellas with no lessons yet still show, marked "coming soon".
const BUSINESS_UMBRELLAS = [
  { id: "meetings", label: "Meetings", emoji: "🗓️" },
  { id: "pitching", label: "Pitching & Proposals", emoji: "💡" },
  { id: "management", label: "Management & Leadership", emoji: "🧭" },
  { id: "project", label: "Project Work", emoji: "📋" },
  { id: "negotiation", label: "Negotiation & Deals", emoji: "🤝" },
  { id: "everyday", label: "Everyday Workplace", emoji: "☕" },
];

// Industry tracks from the Video Category Map. Picking one adds that
// industry's word bank to every lesson; industry-specific videos will be
// tagged with these ids once they exist.
const BUSINESS_INDUSTRIES = [
  { id: "core", label: "All industries", terms: [] },
  { id: "nonprofit", label: "Nonprofit & Development",
    terms: ["grant", "donor", "funder", "theory of change", "impact", "beneficiaries", "M&E (monitoring and evaluation)", "logframe", "in-kind contribution"] },
  { id: "finance", label: "Finance & Banking",
    terms: ["ROI", "cash flow", "portfolio", "due diligence", "liquidity", "quarterly results", "compliance", "forecast"] },
  { id: "tech", label: "Tech & Startups",
    terms: ["MVP", "roadmap", "sprint", "scale", "user acquisition", "burn rate", "runway", "product-market fit"] },
  { id: "healthcare", label: "Healthcare",
    terms: ["patient outcomes", "clinical trial", "protocol", "compliance", "care pathway", "stakeholders", "reimbursement"] },
  { id: "construction", label: "Construction & Engineering",
    terms: ["tender", "bill of quantities", "site visit", "subcontractor", "specifications", "snag list", "milestone payment"] },
  { id: "energy", label: "Oil, Gas & Energy",
    terms: ["upstream", "downstream", "HSE (health, safety, environment)", "barrel", "refinery", "offtake agreement", "renewables"] },
  { id: "retail", label: "Retail & Hospitality",
    terms: ["footfall", "margin", "inventory", "supplier", "guest experience", "upselling", "peak season"] },
  { id: "government", label: "Government & Public Sector",
    terms: ["procurement", "public tender", "policy brief", "ministry", "budget allocation", "regulation", "stakeholder consultation"] },
];
