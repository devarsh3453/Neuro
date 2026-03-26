// Seed script — Task 1.4: Question data
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const User = require('./models/User');

const questions = [
  {
    questionText: 'What is the time complexity of binary search?',
    type: 'mcq',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    idealExplanation:
      'Binary search works by repeatedly dividing the search space in half. Each step eliminates half the remaining elements, so the number of steps grows logarithmically with input size, giving O(log n) complexity.',
    difficulty: 'medium',
    subject: 'Data Structures',
  },
  {
    questionText: 'What does JWT stand for?',
    type: 'mcq',
    options: [
      'JavaScript Web Token',
      'JSON Web Token',
      'Java Web Transfer',
      'JavaScript Wrapped Transfer',
    ],
    correctAnswer: 'JSON Web Token',
    idealExplanation:
      'JWT stands for JSON Web Token. It is an open standard (RFC 7519) that defines a compact, self-contained way for securely transmitting information between parties as a JSON object, commonly used for authentication and authorization.',
    difficulty: 'easy',
    subject: 'Web Development',
  },
  {
    questionText: 'What is a primary key in a database?',
    type: 'mcq',
    options: [
      'A key that encrypts the database',
      'A column that uniquely identifies each row in a table',
      'The first column of any table',
      'A foreign reference to another table',
    ],
    correctAnswer: 'A column that uniquely identifies each row in a table',
    idealExplanation:
      'A primary key is a column (or set of columns) in a relational database table that uniquely identifies each row. It must contain unique values and cannot be NULL. It enforces entity integrity and is used to establish relationships between tables via foreign keys.',
    difficulty: 'easy',
    subject: 'Databases',
  },
  {
    questionText: 'What is the difference between == and === in JavaScript?',
    type: 'mcq',
    options: [
      'There is no difference',
      '== checks value only; === checks value and type',
      '=== checks value only; == checks value and type',
      '== is used for numbers; === is used for strings',
    ],
    correctAnswer: '== checks value only; === checks value and type',
    idealExplanation:
      'In JavaScript, == performs loose equality comparison with type coercion — it converts operands to the same type before comparing. === performs strict equality comparison without type coercion, meaning both the value AND the type must be identical. For example, 0 == "0" is true but 0 === "0" is false.',
    difficulty: 'medium',
    subject: 'JavaScript',
  },
  {
    questionText: 'What does REST stand for in REST API?',
    type: 'mcq',
    options: [
      'Remote Execution State Transfer',
      'Representational State Transfer',
      'Reliable Service Transport',
      'Resource Encoding Standard Transfer',
    ],
    correctAnswer: 'Representational State Transfer',
    idealExplanation:
      'REST stands for Representational State Transfer. It is an architectural style for designing networked applications that uses stateless communication, standard HTTP methods (GET, POST, PUT, DELETE), and a resource-based URL structure to enable scalable and interoperable web services.',
    difficulty: 'easy',
    subject: 'Web Development',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    await Question.deleteMany({});
    console.log('Existing questions cleared.');

    await Question.insertMany(questions);
    console.log('✅ 5 questions seeded successfully');

    // Create admin user
    const adminEmail = 'admin@neurotrace.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        name: 'NeuroTrace Admin',
        email: adminEmail,
        passwordHash: 'Admin2024',
        role: 'admin',
      });
      await admin.save();
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
