import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FIXTURES } from "./fixtures.mjs";

const prisma = new PrismaClient();

async function main() {
  // 1) Seed matches (idempotent: skip if a match with same teams+kickoff exists)
  let inserted = 0;
  for (const f of FIXTURES) {
    const kickoff = new Date(f.kickoff);
    const existing = await prisma.match.findFirst({
      where: { homeTeam: f.home, awayTeam: f.away, kickoff },
    });
    if (!existing) {
      await prisma.match.create({
        data: {
          groupName: f.group,
          homeTeam: f.home,
          awayTeam: f.away,
          kickoff,
        },
      });
      inserted++;
    }
  }
  console.log(`Matches: ${inserted} inserted, ${FIXTURES.length - inserted} already present.`);

  // 2) Seed admin user from env
  const email = (process.env.ADMIN_EMAIL || "admin@yourcompany.com").toLowerCase();
  const name = process.env.ADMIN_NAME || "Admin";
  const password = process.env.ADMIN_PASSWORD || "change-this-password";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { isAdmin: true },
    create: { name, email, passwordHash, isAdmin: true },
  });
  console.log(`Admin user ready: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
