import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";


const TopicPage = () => {
    const { id } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({error: null, errorMsg: null});
    const baseUrl = import.meta.env.VITE_BASE_URL;

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




        if(loading) return <div>Loading...</div>
        if (error) {
            return (
              <div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  Error: {error} {/* Render error message */}
                </div>
              </div>
            );
          }

        return(
            <div>
                <h1>{topic.title}</h1>
                <p>{topic.content}</p>

                <ul>
                    {topic.messages.map(message => (
                        <li key={message._id}>
                          <p>{message.content}</p>
                          <small>{message.postedBy}</small>
                        </li>
                    ))}
                </ul>
            </div>
        )
   

};

export default TopicPage;