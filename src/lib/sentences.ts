// Sentence templates with a blank (___) where the target word goes.
// Each entry maps an English word to an array of possible sentence contexts.
// We store multiple sentences per word when available for variety.

export interface SentenceTemplate {
  sentence: string; // Contains ___ as placeholder
  word: string;     // The correct word
}

const SENTENCES: Record<string, string[]> = {
  analyze: [
    "The scientists need to ___ the data before publishing their findings.",
    "We must carefully ___ the results of the experiment.",
  ],
  approach: [
    "The team decided to ___ the problem from a different angle.",
    "We need a new ___ to solve this issue.",
  ],
  area: [
    "This ___ of research has received a lot of attention recently.",
    "The ___ surrounding the university is very peaceful.",
  ],
  assess: [
    "Teachers need to ___ student performance regularly.",
    "It is important to ___ the risks before making a decision.",
  ],
  assume: [
    "We cannot ___ that everyone agrees with the proposal.",
    "Do not ___ anything without evidence.",
  ],
  authority: [
    "The local ___ approved the construction project.",
    "She spoke with great ___ on the subject.",
  ],
  available: [
    "The report will be ___ online next week.",
    "All ___ resources should be used efficiently.",
  ],
  benefit: [
    "Students will ___ from the new library resources.",
    "The main ___ of exercise is better health.",
  ],
  concept: [
    "The ___ of freedom is central to democratic societies.",
    "This is a difficult ___ for beginners to understand.",
  ],
  consistent: [
    "Her work has been ___ throughout the semester.",
    "The results are ___ with previous studies.",
  ],
  constitute: [
    "These factors ___ a serious threat to public health.",
    "Women ___ over half of the population.",
  ],
  context: [
    "You need to understand the ___ in which the word is used.",
    "The historical ___ of the event is important.",
  ],
  contract: [
    "Both parties signed the ___ last week.",
    "The company won a major government ___.",
  ],
  create: [
    "The goal is to ___ a more sustainable environment.",
    "Artists ___ works that reflect society.",
  ],
  data: [
    "The ___ shows a clear trend over the past decade.",
    "We need more ___ to support this hypothesis.",
  ],
  define: [
    "It is important to clearly ___ the terms used in the study.",
    "How do you ___ success?",
  ],
  derive: [
    "Many English words ___ from Latin and Greek roots.",
    "The formula can be ___ from basic principles.",
  ],
  distribute: [
    "The organization will ___ food to families in need.",
    "Wealth is not equally ___ in society.",
  ],
  economy: [
    "The global ___ has been affected by the pandemic.",
    "A strong ___ depends on stable institutions.",
  ],
  environment: [
    "Protecting the ___ is a shared responsibility.",
    "The work ___ can affect employee productivity.",
  ],
  establish: [
    "The university was ___ in 1850.",
    "We need to ___ clear guidelines for the project.",
  ],
  estimate: [
    "Scientists ___ that the project will take three years.",
    "The initial ___ was far too optimistic.",
  ],
  evidence: [
    "There is strong ___ to support the theory.",
    "The ___ presented in court was convincing.",
  ],
  export: [
    "The country's main ___ is coffee.",
    "They plan to ___ their products to Europe.",
  ],
  factor: [
    "Cost is an important ___ in the decision.",
    "Several ___s contributed to the success of the project.",
  ],
  finance: [
    "The government agreed to ___ the research program.",
    "She studied ___ at university.",
  ],
  formula: [
    "The mathematical ___ is used to calculate interest.",
    "There is no simple ___ for success.",
  ],
  function: [
    "The main ___ of the heart is to pump blood.",
    "The device does not ___ properly in cold weather.",
  ],
  identify: [
    "Researchers were able to ___ the cause of the problem.",
    "Can you ___ the main themes in the text?",
  ],
  income: [
    "The average household ___ has increased slightly.",
    "People with low ___ often struggle to afford housing.",
  ],
  indicate: [
    "The results ___ a significant improvement.",
    "Studies ___ that exercise reduces stress.",
  ],
  individual: [
    "Each ___ has the right to express their opinion.",
    "The needs of the ___ must be considered.",
  ],
  interpret: [
    "Students should learn how to ___ statistical data.",
    "Different people may ___ the same text differently.",
  ],
  involve: [
    "The project will ___ collaboration between departments.",
    "What does the job ___?",
  ],
  issue: [
    "Climate change is a critical ___ facing the world today.",
    "The committee raised an important ___.",
  ],
  require: [
    "All students are ___ to submit their work on time.",
    "The job ___s excellent communication skills.",
  ],
  research: [
    "Further ___ is needed to confirm these findings.",
    "She is conducting ___ on renewable energy.",
  ],
  respond: [
    "The government was slow to ___ to the crisis.",
    "Please ___ to the email by Friday.",
  ],
  significant: [
    "There has been a ___ increase in sales this quarter.",
    "The discovery was ___ for the field of medicine.",
  ],
  similar: [
    "The two studies reached ___ conclusions.",
    "This method is ___ to the one used last year.",
  ],
  source: [
    "Always cite your ___s when writing an academic paper.",
    "What is the ___ of this information?",
  ],
  specific: [
    "Please provide ___ examples to support your argument.",
    "The instructions were very ___.",
  ],
  structure: [
    "The ___ of the essay should be clear and logical.",
    "The building's ___ was damaged in the earthquake.",
  ],
  theory: [
    "Darwin's ___ of evolution changed the way we think.",
    "In ___, the plan should work perfectly.",
  ],
  vary: [
    "Prices ___ depending on the season.",
    "Opinions ___ widely on this topic.",
  ],
  achieve: [
    "She worked hard to ___ her goals.",
    "It is difficult to ___ perfection.",
  ],
  acquire: [
    "The company plans to ___ a smaller firm.",
    "Children ___ language skills rapidly.",
  ],
  affect: [
    "The new policy will ___ thousands of workers.",
    "How does stress ___ your health?",
  ],
  appropriate: [
    "Please wear ___ clothing to the interview.",
    "Is this behavior ___ in a professional setting?",
  ],
  community: [
    "The local ___ organized a charity event.",
    "A strong ___ is built on trust and cooperation.",
  ],
  complex: [
    "The issue is more ___ than it appears.",
    "This is a ___ problem with no easy solution.",
  ],
  evaluate: [
    "We need to ___ the effectiveness of the program.",
    "Teachers ___ students through tests and assignments.",
  ],
  feature: [
    "The main ___ of the software is its ease of use.",
    "The article ___s interviews with leading experts.",
  ],
  focus: [
    "The study will ___ on the effects of social media.",
    "It is hard to ___ in a noisy environment.",
  ],
  impact: [
    "Technology has had a huge ___ on education.",
    "The ___ of the new law was felt immediately.",
  ],
  maintain: [
    "It is important to ___ a healthy lifestyle.",
    "The company ___s high standards of quality.",
  ],
  obtain: [
    "You need to ___ permission before starting the project.",
    "The data was ___ed through surveys.",
  ],
  participate: [
    "All students are encouraged to ___ in the discussion.",
    "She decided to ___ in the competition.",
  ],
  potential: [
    "The new technology has great ___ for the future.",
    "We must recognize the ___ risks involved.",
  ],
  previous: [
    "The results contradict ___ findings.",
    "She had no ___ experience in the field.",
  ],
  primary: [
    "The ___ goal of the project is to reduce costs.",
    "Education is a ___ concern for many parents.",
  ],
  region: [
    "The ___ is known for its agricultural production.",
    "Different ___s have different climates.",
  ],
  relevant: [
    "Only ___ information should be included in the report.",
    "Is this ___ to our discussion?",
  ],
  resource: [
    "Natural ___s must be managed carefully.",
    "The library is a valuable ___ for students.",
  ],
  strategy: [
    "The company developed a new marketing ___.",
    "What ___ will you use to solve this problem?",
  ],
  transfer: [
    "She decided to ___ to another university.",
    "The ___ of knowledge is essential in education.",
  ],
  contribute: [
    "Everyone should ___ to the team's success.",
    "Several factors ___ to global warming.",
  ],
  demonstrate: [
    "The experiment ___s the effect of heat on metals.",
    "Can you ___ how the machine works?",
  ],
  ensure: [
    "We must ___ that all safety procedures are followed.",
    "Please ___ your seatbelt is fastened.",
  ],
  illustrate: [
    "The chart ___s the growth in population over time.",
    "This example ___s the point clearly.",
  ],
  interact: [
    "Students need to ___ with their peers more often.",
    "How do these chemicals ___ with each other?",
  ],
  justify: [
    "How can you ___ such a large expense?",
    "The results do not ___ further investment.",
  ],
  outcome: [
    "The ___ of the election surprised everyone.",
    "We cannot predict the ___ with certainty.",
  ],
  publish: [
    "The journal will ___ the article next month.",
    "She hopes to ___ her research soon.",
  ],
  remove: [
    "Please ___ all personal items from the desk.",
    "The committee voted to ___ the chairman.",
  ],
  sufficient: [
    "There is not ___ evidence to convict the suspect.",
    "Is this amount ___ for your needs?",
  ],
  technology: [
    "Modern ___ has transformed the way we communicate.",
    "The company invests heavily in new ___.",
  ],
  valid: [
    "Your passport must be ___ for at least six months.",
    "That is a ___ point worth considering.",
  ],
  access: [
    "Students have ___ to the online library 24/7.",
    "The building provides wheelchair ___.",
  ],
  communicate: [
    "It is important to ___ clearly in the workplace.",
    "Technology helps people ___ across distances.",
  ],
  contrast: [
    "In ___ to the first study, this one found no effect.",
    "The ___ between the two approaches is striking.",
  ],
  debate: [
    "The ___ on climate policy continues in parliament.",
    "Scholars ___ the origins of the theory.",
  ],
  goal: [
    "The main ___ of the program is to reduce poverty.",
    "Setting clear ___s helps you stay motivated.",
  ],
  implement: [
    "The government plans to ___ new regulations.",
    "It took years to ___ the policy changes.",
  ],
  investigate: [
    "Police are continuing to ___ the incident.",
    "Researchers will ___ the long-term effects.",
  ],
  obvious: [
    "It was ___ that the experiment had failed.",
    "The answer seemed ___ to everyone.",
  ],
  predict: [
    "It is difficult to ___ future trends accurately.",
    "Scientists ___ that temperatures will continue to rise.",
  ],
  professional: [
    "She maintains a ___ attitude at all times.",
    "Seek ___ advice before making financial decisions.",
  ],
  resolve: [
    "The committee was unable to ___ the dispute.",
    "We need to ___ this issue before moving forward.",
  ],
  stress: [
    "The report ___es the importance of early intervention.",
    "Work-related ___ can lead to health problems.",
  ],
  challenge: [
    "The biggest ___ is finding enough funding.",
    "We need to ___ existing assumptions.",
  ],
  conflict: [
    "There is a ___ between the two theories.",
    "The ___ was resolved through negotiation.",
  ],
  decline: [
    "Sales have ___d sharply this quarter.",
    "There has been a steady ___ in enrollment.",
  ],
  enable: [
    "The scholarship will ___ her to continue studying.",
    "New tools ___ faster data analysis.",
  ],
  expand: [
    "The company plans to ___ into new markets.",
    "We need to ___ our understanding of the issue.",
  ],
  generate: [
    "Solar panels ___ electricity from sunlight.",
    "The project aims to ___ new ideas.",
  ],
  modify: [
    "We may need to ___ our approach based on the results.",
    "The design was ___ied to improve efficiency.",
  ],
  network: [
    "Building a professional ___ is important for career growth.",
    "The computer ___ was down for several hours.",
  ],
  objective: [
    "The main ___ of the study is to test the hypothesis.",
    "Try to remain ___ when evaluating the evidence.",
  ],
  target: [
    "The ___ audience for this product is young adults.",
    "We need to ___ our efforts more effectively.",
  ],
  trend: [
    "There is a growing ___ toward remote work.",
    "The ___ in the data shows a clear pattern.",
  ],
  accurate: [
    "The report must be ___ and up to date.",
    "How ___ are these measurements?",
  ],
  capable: [
    "She is ___ of handling complex tasks independently.",
    "The software is ___ of processing large datasets.",
  ],
  diverse: [
    "The university has a ___ student population.",
    "A ___ range of opinions was expressed.",
  ],
  enhance: [
    "The new features will ___ the user experience.",
    "Regular practice can ___ your language skills.",
  ],
  expert: [
    "An ___ in the field was consulted.",
    "You should seek ___ advice on legal matters.",
  ],
  flexible: [
    "The schedule is ___ enough to accommodate changes.",
    "Employees prefer ___ working arrangements.",
  ],
  incorporate: [
    "The plan should ___ feedback from all stakeholders.",
    "We need to ___ new technologies into our workflow.",
  ],
  initiate: [
    "The government decided to ___ peace talks.",
    "Who will ___ the discussion?",
  ],
  minimum: [
    "The ___ age requirement for the position is 18.",
    "Keep expenses to a ___.",
  ],
  rational: [
    "We need to make a ___ decision based on facts.",
    "His argument was calm and ___.",
  ],
  recover: [
    "The economy is expected to ___ by next year.",
    "It took months to ___ from the injury.",
  ],
  reveal: [
    "The study ___s important new findings.",
    "The investigation ___ed widespread fraud.",
  ],
  transform: [
    "Technology can ___ the way we learn.",
    "The city has been ___ed over the last decade.",
  ],
  adapt: [
    "Species must ___ to survive in changing environments.",
    "We need to ___ our strategy to new conditions.",
  ],
  comprehensive: [
    "The report provides a ___ overview of the situation.",
    "A ___ analysis of the data is needed.",
  ],
  confirm: [
    "The results ___ our initial hypothesis.",
    "Please ___ your attendance by email.",
  ],
  eliminate: [
    "The goal is to ___ unnecessary expenses.",
    "We must ___ all sources of error.",
  ],
  foundation: [
    "Trust is the ___ of any good relationship.",
    "The ___ funded several research projects.",
  ],
  guarantee: [
    "There is no ___ that the plan will succeed.",
    "The product comes with a two-year ___.",
  ],
  innovate: [
    "Companies must ___ to stay competitive.",
    "The ability to ___ is crucial in today's market.",
  ],
  priority: [
    "Safety should be the top ___ in any workplace.",
    "Education is a ___ for the new government.",
  ],
  submit: [
    "Please ___ your application before the deadline.",
    "Students must ___ their essays online.",
  ],
  survive: [
    "Many small businesses struggle to ___ in a recession.",
    "Only the strongest species ___.",
  ],
  unique: [
    "Each student has a ___ learning style.",
    "The building has a ___ architectural design.",
  ],
};

export function getSentenceForWord(word: string): SentenceTemplate | null {
  const sentences = SENTENCES[word.toLowerCase()];
  if (!sentences || sentences.length === 0) return null;
  const sentence = sentences[Math.floor(Math.random() * sentences.length)];
  return { sentence, word };
}

export function getWordsWithSentences(): string[] {
  return Object.keys(SENTENCES);
}
