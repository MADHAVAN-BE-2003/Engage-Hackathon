const express = require('express');
const authMiddleware = require('./../middlewares/authMiddleware');
const User = require('./../models/User');
const router = express.Router();

const questions = {
    'React.js': {
        Easy: { question: 'What is JSX?', answer: 'JSX is a syntax extension for JavaScript that looks similar to XML or HTML and is used with React to describe UI structure.' },
        Medium: { question: 'Explain the lifecycle of a React component.', answer: 'The React component lifecycle consists of phases: Mounting, Updating, and Unmounting. Each phase has methods like componentDidMount, shouldComponentUpdate, and componentWillUnmount.' },
        Hard: { question: 'How do you manage state in React?', answer: 'State in React is managed using useState for local state and useContext or libraries like Redux for global state management.' }
    },
    'Node.js': {
        Easy: {
            question: 'What is Node.js?',
            answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows you to execute JavaScript code server-side.'
        },
        Medium: {
            question: 'Explain middleware in Node.js.',
            answer: 'Middleware in Node.js refers to functions that have access to the request, response, and the next middleware function in the application\'s request-response cycle, often used for logging, authentication, and error handling.'
        },
        Hard: {
            question: 'How does event-driven programming work in Node.js?',
            answer: 'In Node.js, event-driven programming is a paradigm where the flow of the program is determined by events such as user actions or messages from other programs. Node.js uses an event loop to handle asynchronous operations efficiently.'
        }
    }

};

router.get('/question', (req, res) => {
    const { skill, difficulty } = req.query;
    const questionData = questions[skill]?.[difficulty];
    if (questionData) {
        return res.status(200).json({ question: questionData.question });
    }
    return res.status(404).json({ message: 'Question not found' });
});

router.post('/submit', authMiddleware, async (req, res) => {
    const { skill, difficulty, code } = req.body;
    const email = req.user.email;

    try {
        const result = evaluateCode(skill, difficulty, code);

        if (result === 'Code passed all test cases!') {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const alreadyCompleted = user.completedTests.some(test => test.skill === skill && test.difficulty === difficulty);
            if (!alreadyCompleted) {
                user.completedTests.push({ skill, difficulty });
                await user.save();
            }
            res.status(200).json({ success: true, message: 'Test completed and saved!', result });
        } else {
            res.status(200).json({ success: false, message: 'Test failed. Try again.', result });
        }
    } catch (error) {
        console.error('Error in submit route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


function evaluateCode(skill, difficulty, code) {
    const expectedAnswer = questions[skill]?.[difficulty]?.answer;

    if (!expectedAnswer) {
        return 'Question or answer not found!';
    }

    if (code.trim() === expectedAnswer.trim()) {
        return 'Code passed all test cases!';
    } else {
        return `Incorrect answer. Expected: "${expectedAnswer}"`;
    }
}

module.exports = router;
