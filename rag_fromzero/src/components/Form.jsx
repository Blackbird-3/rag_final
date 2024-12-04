// import {useState} from 'react';
// import ReactMarkdown from 'react-markdown';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import axios from 'axios';
// import { CircularProgress } from '@mui/material';
// function Form() {
//     const [question, setQuestion] = useState('')
//     const [error, setError] = useState('')
//     const [answer, setAnswer] = useState('')
//     const [loading, setLoading] = useState(false)
//     const handleSubmit = async (e) => {
//         setAnswer('')
//         setLoading(true)
//         e.preventDefault()
//         if (question.trim() === '') {
//             setError('Please enter a question')
//         }
//         setError('');
//         await getAnswer();
//     };
//     async function getAnswer() {
//         setLoading(true);
//         let query = question;
//         const response = await axios.post('http://44.218.218.202/answer', {query: query});
//         // const response = await axios.post('http://127.0.0.1:5001/answer', {query: query});
//         setLoading(false);
//         console.log(response.data);
//         setAnswer(response.data.answer);
//     }
// return (
//     <>
//     <form className='w-full' onSubmit={handleSubmit}>
//             <TextField
//                     label="Ask a question"
//                     variant="filled"
//                     fullWidth
//                     value={question}
//                     onChange={(e) => {setQuestion(e.target.value)}}
//                     error={!!error}
//                     helperText={error}
//                     type="text"
//                     placeholder="Type your question here"
//                     InputProps={{
//                             style: {color: 'white'},
//                             classes: {
//                                     input: 'white-placeholder'
//                             }
//                     }}
//                     required
//             />
//             <Button className='w-48 mb-5 bg-black rounded-lg' 
//             type='submit' 
//             variant= "contained" 
//             style={{margin: "20px",
//                 backgroundColor: "#8184D2",
//                 borderRadius: "20px",
//             }}
//             >
//                 Submit</Button>
//     </form>
//     <div className="flex flex-row p-5">
//         <div className="bg-black p-2 m-2 rounded-md cursor-pointer"></div>
//     </div>
//     {loading && (
//         <CircularProgress color="inherit" sx={{color: "white"}} />
//     )}
//     {answer && (
//     <div className='max-w-4xl mx-auto p-6 bg-indigo-900 text-white rounded-lg mb-5'>
//         <ReactMarkdown>{answer}</ReactMarkdown>
//     </div>)}
//     </>
// )
// }
// export default Form

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function Form() {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (question.trim() === '') {
            setError('Please enter a question');
            return;
        }

        const userMessage = { role: 'user', content: question };
        setMessages((prev) => [...prev, userMessage]);

        setQuestion('');
        setLoading(true);

        try {
            const response = await axios.post('http://44.218.218.202/answer', { query: question });
            const aiMessage = {
                role: 'assistant',
                content: response.data.answer,
                citations: response.data.citations || [],
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error fetching answer:', error);
            setMessages((prev) => [...prev, {
                role: 'assistant', 
                content: 'Sorry, there was an error processing your request.',
                citations: []
            }]);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="messages" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: '10px',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '60%',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: message.role === 'user' ? '#fd356e' : '#212227',
                                color: 'white',
                            }}
                        >
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                            {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#CBD5E0' }}>
                                    <strong>Citations:</strong>
                                    <ul>
                                        {message.citations.map((citation, idx) => (
                                            <li key={idx}>
                                                <em>{citation.content.slice(0, 200)}...</em>
                                                <br />
                                                <strong>Source:</strong> {citation.metadata.source}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div
                className="input-area"
                style={{ padding: '10px', backgroundColor: '#8f0d0d', display: 'flex', alignItems: 'center' , borderRadius: '10px'}}
            >
                <TextField
                    label="Ask a question"
                    variant="filled"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    error={!!error}
                    helperText={error}
                    style={{ marginRight: '10px', backgroundColor: 'white', borderRadius: '10px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: '#fd356e',
                        borderRadius: '10px',
                    }}
                >
                    Submit
                </Button>
                {loading && <CircularProgress color="inherit" sx={{ color: 'white', marginLeft: '10px' }} />}
                <Button
                    variant="contained"
                    onClick={scrollToBottom}
                    style={{
                        backgroundColor: '#fd356e',
                        borderRadius: '10px',
                        marginLeft: '10px',
                    }}
                >
                    ↓
                </Button>
            </div>
        </div>
    );
}

export default Form;