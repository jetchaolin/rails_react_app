// API_URL comes from the .env.development file
import React, { useState, useEffect } from 'react';
import { deletePost as deletePostService, fetchAllPosts } from "../../services/postService";
import { Link } from 'react-router-dom';

function PostsList() {    
   const [posts, setPosts] = useState([]);
   const [, setLoading] = useState(true);
   const [, setError] = useState(null);
   // Fetch posts from the API
   useEffect(() => {
      async function loadPosts() {
         try {
            const allPostsFetched = await fetchAllPosts();
            setPosts(allPostsFetched);
            setLoading(false);
         } catch (e) {
            setError(e);
            setLoading(false);
         }
      };
      loadPosts();
   }, []);

   const deletePost = async (id) => {
      try {
         await deletePostService(id);
         setPosts(posts.filter((post) => post.id !== id));
      } catch (e) {
         console.log("Failed to delete the post: ", e);
      }
   };

   return (
      <div>
         {posts.map((post) => (
               <div key={post.id} className="post-container">
                  <h2>
                     <Link to={`/posts/${post.id}`} className='post-title'>
                           {post.title}
                     </Link>
                  </h2>     
                  <div className='post-links'>
                     <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                     {" | "}
                     <button onClick={() => deletePost(post.id)}>Delete</button>
                  </div>             
               </div>
         ))}
      </div>
   );
}

export default PostsList;