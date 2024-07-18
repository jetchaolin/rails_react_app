import { useState } from "react";

// This file might miss a fix for post that requires an import

function PostForm({ post, headerText, onSubmit, buttonText }) {

   const [formData, setFormData] = useState(
      post || {
         title: "",
         body: "",
      }
   );
   return (
      <div>
         <h2>{headerText}</h2>
         <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
         }}
         >
            <div>
               <label htmlFor="title">Title: </label>
               <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        title: e.target.value,
                     })
                  }
               />
            </div>
            <div>
               <label htmlFor="body">Body:</label>
               <textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        body: e.target.value,
                     })
                  }
               />
            </div>
            <div>
               <button type="submit">{buttonText}</button>
            </div>
         </form>
      </div>
   );
}

export default PostForm;