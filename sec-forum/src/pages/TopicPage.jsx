import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import { useAuth } from "./AuthProvider";

const TopicPage = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState("");
    const {  user } = useAuth();
    const handleChange = (e) => {
      setFormData(e.target.value);
    };

    // Handle new message submission.
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`/api/topic/message`, { content: formData, userId: user.id, topicId: id });
        const savedMessage = response.data;
        console.log("New message added:", savedMessage);
        setTopic(prevTopic => ({
          ...prevTopic, messages: [...prevTopic.messages, savedMessage],
          latestMessageUpdate: savedMessage.updateAt
        }))
      } catch (err) {
        setError("An error occurred while adding the topic.");
        console.error("Error adding topic:", err);
      } finally {
        setFormData("");
      }
    };

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const resp = await axios.get(`/api/topic/${id}`)
                setTopic(resp.data)
                
            } catch (err) {
                if(err.response) setError(err.response.data.message || "An error occurred while fetching the topic");
                else setError("Network error or request failed");           
            } finally{
                setLoading(false);
            }
        }

        fetchTopic();
        
    },[id])


    if (loading) return (
        <div style={{ 
          width: "100vw", 
          minHeight: "100vh", 
          backgroundColor: "#f4f4f9", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "1.5rem", 
          fontFamily: "'Roboto', sans-serif", 
          color: "#444" 
        }}>
          Loading...
        </div>
      );
      
      if (error) {
        return (
          <div style={{ 
            width: "100vw", 
            minHeight: "100vh", 
            backgroundColor: "#f4f4f9", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontFamily: "'Roboto', sans-serif" 
          }}>
            <div style={{ 
              backgroundColor: "#ff4b5c", 
              padding: "20px 40px", 
              borderRadius: "8px", 
              color: "white", 
              fontWeight: "bold", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
            }}>
              Error: {error}
            </div>
          </div>
        );
      }
      
      return (
        <div style={{
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: "#f4f4f9",
          padding: "60px 40px",
          boxSizing: "border-box",
          fontFamily: "'Roboto', sans-serif"
        }}>
          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}>
            <h1 style={{
              fontSize: "2rem",
              color: "#444",
              marginBottom: "30px",
              fontWeight: "500"
            }}>
              {topic.title}
            </h1>
      
            <ul style={{ listStyle: "none", padding: 0 }}>
              {topic.messages.map(message => (
                <li key={message._id} style={{
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <p style={{
                    marginBottom: "10px",
                    fontSize: "1rem",
                    color: "#333"
                  }}>
                    {message.content}
                  </p>
                  <small style={{
                    color: "#888",
                    fontSize: "0.9rem"
                  }}>
                    Posted by: {message.postedBy}
                  </small>
                </li>
              ))}
            </ul>
            <form style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "30px", }}>
          <input
            type="text"
            name="title"
            placeholder="New message..."
            value={formData}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#fff",
              color: "#333",
              outline: "none",
              width: "100%",
              maxWidth: "600px",
              transition: "border-color 0.3s ease",
            }}
          />
        </form>
        <button
          onClick={onSubmit}
          style={{
            backgroundColor: "#ff4b5c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 24px",
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: "30px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#ff2a3b"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#ff4b5c"}
        >
          Add New Message
        </button>
          </div>
        </div>
      );
   

};

export default TopicPage;