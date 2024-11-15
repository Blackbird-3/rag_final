import {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
function Form() {
    const [question, setQuestion] = useState('')
    const [error, setError] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        setAnswer('')
        setLoading(true)
        e.preventDefault()
        if (question.trim() === '') {
            setError('Please enter a question')
        }
        setError('');
        await getAnswer();
    };
    async function getAnswer() {
        setLoading(true);
        let query = question;
        const response = await axios.post('http://127.0.0.1:5001/answer', {query: query});
        setLoading(false);
        console.log(response.data);
        setAnswer(response.data.answer);
    }
return (
    <>
    <form className='w-full' onSubmit={handleSubmit}>
            <TextField
                    label="Ask a question"
                    variant="filled"
                    fullWidth
                    value={question}
                    onChange={(e) => {setQuestion(e.target.value)}}
                    error={!!error}
                    helperText={error}
                    type="text"
                    placeholder="Type your question here"
                    InputProps={{
                            style: {color: 'white'},
                            classes: {
                                    input: 'white-placeholder'
                            }
                    }}
                    required
            />
            <Button className='w-48 mb-5 bg-black rounded-lg' 
            type='submit' 
            variant= "contained" 
            style={{margin: "20px",
                backgroundColor: "#8184D2",
                borderRadius: "20px",
            }}
            >
                Submit</Button>
    </form>
    <div className="flex flex-row p-5">
        <div className="bg-black p-2 m-2 rounded-md cursor-pointer"></div>
    </div>
    {loading && (
        <CircularProgress color="inherit" sx={{color: "white"}} />
    )}
    {answer && (
    <div className='max-w-4xl mx-auto p-6 bg-indigo-900 text-white rounded-lg mb-5'>
        <ReactMarkdown>{answer}</ReactMarkdown>
    </div>)}
    </>
)
}
export default Form