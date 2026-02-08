import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const educationData = [
  {
    title: "Understanding Farm Budgeting",
    description: "Learn the basics of creating a budget for your farm to track expenses and income effectively.",
    content: `
      ## Why Budgeting Matters
      A budget helps you plan ahead. It tells you if you have enough money to buy seeds, fertilizer, and pay for labor.

      ## Key Components
      1. **Income**: Money you expect to get from selling crops, milk, or eggs.
      2. **Expenses**: Money you spend on inputs like seeds, feed, and labor.
      3. **Profit**: Income minus Expenses.

      ## Implementation
      Start by writing down all your expected expenses for the season. Then estimate your income. Check if Income > Expenses.
    `,
    order: 1
  },
  {
    title: "Savings Strategies",
    description: "Discover simple ways to save money for emergencies and future investments.",
    content: `
      ## The Power of Saving
      Saving even a small amount regularly can build up to a large sum over time.

      ## Tips
      - **Save after harvest**: When you sell your produce, set aside a portion immediately.
      - **Use a group**: Join a savings group or cooperative.
      - **Cut unnecessary costs**: Review your expenses records to see where you can save.
    `,
    order: 2
  },
  {
    title: "Credit Management",
    description: "How to use loans wisely to grow your farm without getting into debt traps.",
    content: `
      ## Good Debt vs. Bad Debt
      - **Good Debt**: Used to buy things that make more money (e.g., better seeds, a water pump).
      - **Bad Debt**: Used for consumption or things that don't generate income.

      ## Before Borrowing
      1. Can you pay it back?
      2. What is the interest rate?
      3. What happens if crops fail?
    `,
    order: 3
  },
  {
    title: "Market Access",
    description: " strategies to get the best price for your produce and reach more buyers.",
    content: `
      ## Understanding the Market
      - **Know your customer**: Who buys your produce? (Neighbors, local market, aggregators)
      - **Timing**: Can you sell when prices are high?

      ## Value Addition
      - Cleaning, sorting, and packaging your produce can fetch a higher price.
      - Processing (e.g., making jam from fruits) increases shelf life and value.

      ## Collective Marketing
      - Selling together with other farmers gives you bargaining power.
    `,
    order: 4
  },
  {
    title: "Risk Mitigation Strategies",
    description: "Protect your farm from unpredictable events like drought, pests, or price drops.",
    content: `
      ## Types of Risk
      - **Weather**: Drought, floods, hail.
      - **Pests & Diseases**: Crop failure.
      - **Market**: Price fluctuations.

      ## Mitigation Strategies
      - **Diversification**: Plant different crops or keep livestock. If one fails, others may survive.
      - **Insurance**: Consider crop insurance if available.
      - **Emergency Fund**: Keep some savings for bad seasons.
    `,
    order: 5
  },
  {
    title: "Sustainable Agriculture Practices",
    description: "Farming methods that protect the environment and ensure long-term productivity.",
    content: `
      ## Soil Health
      - **Crop Rotation**: Change crops each season to keep soil fertile.
      - **Composting**: Use farm waste to make natural fertilizer.

      ## Water Conservation
      - **Mulching**: Cover soil to keep moisture.
      - **Rainwater Harvesting**: Collect water for dry spells.

      ## Integrated Pest Management
      - Use natural predators and traps instead of just chemicals.
    `,
    order: 6
  }
];

export async function seedEducationData() {
  const colRef = collection(db, "modules");

  try {
    for (const module of educationData) {
      // Check if module with this title already exists
      const q = query(colRef, where("title", "==", module.title));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(colRef, module);
        console.log(`Added module: ${module.title}`);
      } else {
        console.log(`Skipped existing module: ${module.title}`);
      }
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
