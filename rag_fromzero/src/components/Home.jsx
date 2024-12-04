import { useEffect,useRef ,useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";
import ReactMarkdown from 'react-markdown';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const Home = () => {
  // navigate
  const navigate = useNavigate();

  // general states
  const [user, setUser] = useState(null);
  const [loading1, setloading1] = useState(true);

  // get current logged in user
  useEffect(() => {
    account
      .get()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
      })
      .finally(() => setloading1(false));
  }, []);

  // logout states
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [logoutErr, setLogoutErr] = useState(null);
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

  // logout event
  const handleLogout = () => {
    setLogoutLoader(true);
    setLogoutErr(null);
    account
      .deleteSession('current')
      .then((res) => {
        console.log(res);
        setUser(null);
      })
      .catch((err) => {
        setLogoutErr(err.message);
      })
      .finally(() => setLogoutLoader(false));
  };

  return (
    <div className="background">
      {loading1 ? (
        <h5>Please Wait...</h5>
      ) : (
        <>
          {user ? (
            <>
              {/* <div className="user-circle">
                {user.name
                  .split(" ")
                  .map((word, index) =>
                    index === 0 || index === user.name.split(" ").length - 1
                      ? word.charAt(0)
                      : ""
                  )
                  .join("")}
              </div>
              <h5>{user.email}</h5>
              {logoutErr && <div className="error-msg">{logoutErr}</div>}
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                {logoutLoader ? "..." : "Logout"}
              </button> */}
            {/* {messages.length === 0 && (
                <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50%',
                  backgroundColor: '#2f3e46',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '2rem',
                  marginTop: '2rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  background: 'linear-gradient(145deg, #2f3e46, #354f57)',
                  border: '1px solid #3a4a52',
                }}
              >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>How can I help you today?</h2>
              </div>
            )} */}
            {messages.length === 0 && (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50%',
      backgroundColor: '#2f3e46',
      color: 'white',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '2rem',
      marginTop: '10%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(145deg, #2f3e46, #354f57)',
      border: '1px solid #3a4a52',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>How can I help you today?</h2>
    <p style={{ fontSize: '1rem', marginBottom: '1.5rem', color:'#adb5bd' }}>
      Ask me anything. <br />
      I currently have access to the UFM policy and can help you with any questions you have.
    </p>
  </div>
)}

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
                {/* <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                {logoutLoader ? "..." : "Logout"}
              </button>  */}
              
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
                <Button
                    variant="contained"
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#fd356e',
                        borderRadius: '10px',
                        marginLeft: '10px',
                    }}
                >
                    Logout
                </Button>
            </div>
        </div>
            </>
          ) : (
            <>
              <h1>Welcome to EduQuery!</h1>
              <h5>
                BMU&apos;s very own AI assistant to help you with your queries.
              </h5>
              <div className="navigation-btns">
                <button type="button" onClick={() => navigate("/signup")}>
                  Register
                </button>
                <button type="button" onClick={() => navigate("/login")}>
                  Login
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
