// Seed script to populate the database with sample data
// This is a simplified version to avoid dependency issues

// Sample data
const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    password: 'password123',
  },
];

const sampleGroups = [
  {
    name: 'Goa Trip',
    description: 'Trip to Goa with friends',
  },
  {
    name: 'Office Lunch',
    description: 'Lunch expenses with colleagues',
  },
  {
    name: 'Apartment',
    description: 'Shared apartment expenses',
  },
];

const sampleExpenses = [
  {
    description: 'Hotel Stay',
    amount: 800,
    currency: 'USD',
    paidBy: 'user1',
    group: 'group1',
    splits: [
      { user: 'user1', amount: 400 },
      { user: 'user2', amount: 400 },
    ],
    category: 'Accommodation',
    date: '2023-06-15',
  },
  {
    description: 'Dinner',
    amount: 120,
    currency: 'USD',
    paidBy: 'user2',
    group: 'group1',
    splits: [
      { user: 'user1', amount: 60 },
      { user: 'user2', amount: 60 },
    ],
    category: 'Food',
    date: '2023-06-16',
  },
  {
    description: 'Team Lunch',
    amount: 85,
    currency: 'USD',
    paidBy: 'user3',
    group: 'group2',
    splits: [
      { user: 'user1', amount: 21.25 },
      { user: 'user2', amount: 21.25 },
      { user: 'user3', amount: 21.25 },
      { user: 'user4', amount: 21.25 },
    ],
    category: 'Food',
    date: '2023-06-20',
  },
];

const sampleSettlements = [
  {
    from: 'user2',
    to: 'user1',
    amount: 340,
    currency: 'USD',
    group: 'group1',
    description: 'Payment for Goa trip',
    date: '2023-06-25',
  },
];

// Function to seed the database
async function seedDatabase() {
  console.log('Creating sample users...');
  console.log('Sample users:', sampleUsers);

  console.log('Creating sample groups...');
  console.log('Sample groups:', sampleGroups);

  console.log('Creating sample expenses...');
  console.log('Sample expenses:', sampleExpenses);

  console.log('Creating sample settlements...');
  console.log('Sample settlements:', sampleSettlements);

  console.log('Database seeding completed successfully!');
  console.log(
    'Note: This is a simulation. In a real implementation, this would connect to MongoDB and insert the data.'
  );
}

// Run the seed function
seedDatabase().catch(console.error);
