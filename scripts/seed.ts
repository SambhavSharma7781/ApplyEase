import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const JOB_TITLES = [
  "Frontend Engineer", "Backend Developer", "Full Stack Engineer", 
  "Data Scientist", "Product Manager", "UI/UX Designer", 
  "DevOps Engineer", "Machine Learning Engineer", "Systems Architect", 
  "Quality Assurance Tester", "Marketing Specialist", "Sales Representative",
  "HR Manager", "Business Analyst", "Customer Support Lead"
];

const COMPANIES = [
  "TechNova Solutions", "CloudScape Innovations", "DataSync Systems",
  "Nexus Digital", "Vanguard Tech", "Alpha AI", 
  "Quantum Computing Corp", "Stellar Software", "Infinity Labs",
  "Pioneer Networks", "Horizon Platforms", "Apex Analytics",
  "Global Ventures", "Innovatech", "Synergy Studios",
  "Future Dynamics", "Logic Gate", "Binary Builders",
  "CodeCraft Inc.", "Digital Frontier"
];

const LOCATIONS = [
  "New York, NY", "San Francisco, CA", "Austin, TX", "London, UK",
  "Berlin, Germany", "Toronto, Canada", "Singapore", "Remote",
  "Mumbai, India", "Bangalore, India", "Sydney, Australia"
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const JOB_TYPES = ["on-site", "remote", "hybrid"];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting seed process...');

  // Create 20 users and companies
  const companyIds = [];
  
  console.log('Creating users and companies...');
  for (let i = 0; i < COMPANIES.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `founder_${i}@${COMPANIES[i].replace(/\s+/g, '').toLowerCase()}.com`,
        password: "password123", // dummy password
        role: "employer",
      }
    });

    const company = await prisma.company.create({
      data: {
        name: COMPANIES[i],
        description: `We are ${COMPANIES[i]}, a leading company in our industry dedicated to building amazing products.`,
        ownerId: user.id
      }
    });

    companyIds.push(company.id);
  }

  console.log(`Successfully created ${companyIds.length} companies.`);
  console.log('Creating 500 job openings...');

  const jobsData = [];
  for (let i = 0; i < 500; i++) {
    const title = randomChoice(JOB_TITLES);
    const jobType = randomChoice(JOB_TYPES);
    const location = jobType === "remote" ? "Remote" : randomChoice(LOCATIONS);
    
    jobsData.push({
      title: `${title} ${randomChoice(["I", "II", "Senior", "Lead", "Staff", ""])}`.trim(),
      description: `We are looking for a talented ${title} to join our growing team. You will be responsible for building high-quality solutions and working closely with cross-functional teams. Strong problem-solving skills and a passion for technology are a must.\n\nRequirements:\n- 3+ years of experience\n- Strong communication skills\n- Ability to work in a fast-paced environment\n\nBenefits:\n- Competitive salary\n- Health insurance\n- Flexible working hours`,
      location: location,
      salary: randomNumber(50000, 200000),
      employment_Type: randomChoice(EMPLOYMENT_TYPES),
      job_type: jobType,
      companyId: randomChoice(companyIds)
    });
  }

  // Insert all jobs
  let count = 0;
  for (const job of jobsData) {
    await prisma.openings.create({ data: job });
    count++;
    if (count % 100 === 0) {
      console.log(`Created ${count} jobs...`);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
