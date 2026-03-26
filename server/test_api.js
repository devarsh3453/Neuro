async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  let token = '';
  let questionId = '';

  try {
    console.log('1. Logging in...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test2@neurotrace.com',
        password: 'Test1234'
      })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('Login successful.\n');

    console.log('2. Fetching questions...');
    const questionsRes = await fetch(`${baseURL}/questions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const questionsData = await questionsRes.json();
    questionId = questionsData.questions[0]._id;
    console.log(`Found question: ${questionId}\n`);

    console.log('3. Submitting attempt WITH reasoning...');
    const attempt1Res = await fetch(`${baseURL}/attempts`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: questionId,
        timeToFirstInput: 8500,
        editCount: 3,
        totalTime: 35,
        finalAnswer: 'O(log n)',
        reasoningText: 'Binary search divides the array in half each time, which means it eliminates half the elements at every step giving logarithmic time'
      })
    });
    const attempt1Data = await attempt1Res.json();
    console.log('Attempt 1 Result:');
    console.log(JSON.stringify(attempt1Data, null, 2));
    console.log('\n');

    console.log('4. Submitting attempt WITHOUT reasoning...');
    const attempt2Res = await fetch(`${baseURL}/attempts`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: questionId,
        timeToFirstInput: 2000,
        editCount: 0,
        totalTime: 8,
        finalAnswer: 'O(n)',
        reasoningText: ''
      })
    });
    const attempt2Data = await attempt2Res.json();
    console.log('Attempt 2 Result:');
    console.log(JSON.stringify(attempt2Data, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();
