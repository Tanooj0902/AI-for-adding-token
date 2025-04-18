import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

function App() {
  // const [response, setResponse] = useState({
  //   question: '',
  //   answer: ''
  // });
  const [responses, setResponses] = useState([]);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const removeFile = (name) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault(); // handle optional event
    setIsLoading(true);
    const currentInput = input;
    setInput("");
    try {
      const res = await axios.post(`${import.meta.env.REACT_APP_BACKEND_BASEURL}/api/generate`, {
        input: currentInput,
      });
      const newQA = {
        question: currentInput,
        answer: res.data.response,
      };
      setIsLoading(false);
      setResponses((prev) => [...prev, newQA]);
    } catch (error) {
      console.error(error);
      const failedQA = {
        question: currentInput,
        answer: "Failed to get response from API",
      };
      setIsLoading(false);
      setResponses((prev) => [...prev, failedQA]);
    }
  };

  const sendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = { sender: "user", text: input };
      const aiMessage = {
        sender: "ai",
        text: "Hello! How can I help you today?",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.maxHeight = '30vh';
    }
  }, [input]);

  return (
    <div className="parent">
      {responses.length > 0 && (
        <section className="response-section">
          {responses.map((qa, index) => (
            <div className="QNA" key={index}>
              <p className="question-section">
                {/* {qa.question} */}
                <strong className="question-tag">{qa.question}</strong>
              </p>
              <div
                className="answer-section"
                dangerouslySetInnerHTML={{ __html: qa.answer }}
              ></div>
            </div>
          ))}
        </section>
      )}
      <section style={{marginBottom: !responses.length && '33%'}} className="gpt-container">
        <section className="gpt-section">
          <h1 className="main-heading">What can I help with?</h1>
          <div className="main-container">
            <div class="content-area">
              <div className="upload-container">
                {files.map((file, index) => {
                  return (
                    <div className="file-item" key={index}>
                      <div className="file-data">
                        <span className="file-name">{file.name}</span>
                        <span className="file-type">
                          {file.type.replace(/application\//gi, "")}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFile(file.name)}
                        className="remove-button"
                      >
                        <svg
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="upload-button remove-button"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

                {
                  isLoading ? <div class="loader"></div> 
                  : 
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="dynamic-textarea"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}>
                  </textarea>
                }
            </div>

            <div className="button-component">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setFiles((prev) => [...prev, ...newFiles]);
                }}
                style={{ display: "none" }}
                id="fileUploadInput"
              />
              <label htmlFor="fileUploadInput">
                <Tooltip
                  title="Upload files and more"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "black", // Background color
                        color: "#fff", // Text color
                        fontSize: "0.875rem", // Font size
                        padding: "8px 12px", // Padding
                        borderRadius: "8px", // Border radius
                      },
                    },
                    arrow: {
                      sx: { color: "#333" }, // Arrow color (if arrow prop is used)
                    },
                  }}
                  arrow
                >
                  <button
                    type="file"
                    aria-disabled="false"
                    aria-label="Upload files and more"
                    className="upload-button"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label=""
                      class="h-[18px] w-[18px]"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </Tooltip>
              </label>
              <button
                onClick={() => handleSubmit()}
                aria-disabled="false"
                aria-label="Send prompt"
                class="composer-button"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-2xl"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default App;
