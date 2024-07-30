import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, updatePost } from "../../services/postService";
import PostForm from "./PostForm";
import { objectToFormData } from "../../Utils/formDataHelper";

function PostEditForm(){
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current post by id
    // Why not response instead of json? Refactor later maybe.
    const fetchCurrentPost = async () => {
      try {
        const json = await fetchPost(id);
        setPost(json);
      } catch (e) {
        console.error("Failed to fetch the post: ", e);
      }
    };
    fetchCurrentPost();
  }, [id]);

  const handleUpdateSubmit = async (rawData) => {
    const sanitizedData = {
      title: rawData.title,
      body: rawData.body,
      image: rawData.image,
    };
    const formData = objectToFormData({ post: sanitizedData });
    try {
      await updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (e) {
      console.error("Failed to update post: ", e);
    };
}

  if (!post) return <h2>Loading...</h2>;

  return (
    <PostForm
      post={post}
      onSubmit={handleUpdateSubmit}
      headerText="Edit Post"
      buttonText="Update Post"
    />
  );
}

export default PostEditForm;