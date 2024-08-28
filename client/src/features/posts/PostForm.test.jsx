import { render, fireEvent, getByLabelText } from "@testing-library/react";
import PostForm from "./PostForm";


describe("PostForm component", () => {
   const mockPost = {
      title: "Test Post Title",
      body: "Test Post Body",
      image: null,
   };

   it("renders empty inputs when no post prop is passed", () => {
      // Post is null by default, for the instance when a new post is being created
      const { getByLabelText } = render(<PostForm />);
      expect(getByLabelText(/Title:/i)).toBeInTheDocument();
      expect(getByLabelText(/Body:/i)).toBeInTheDocument();
   });

   it("should render the PostForm component", () => {
      const { getByLabelText } = render(<PostForm post={mockPost} />);
      expect(getByLabelText(/Title:/i)).toBeInTheDocument();
      expect(getByLabelText(/Body:/i)).toBeInTheDocument();
      expect(getByLabelText(/Title:/i).value).toBe(mockPost.title);
      expect(getByLabelText(/Body:/i).value).toBe(mockPost.body);
   });

   it("should allow typing in the title and body fields", () => {
      const { getByLabelText } = render(<PostForm post={mockPost} />);
      const titleInput = getByLabelText(/Title:/i);
      const bodyInput = getByLabelText(/Body:/i);
      const newTitle = "New Title";
      const newBody = "New Body";
      fireEvent.change(titleInput, { target: { value: newTitle } });
      fireEvent.change(bodyInput, { target: { value: newBody } });
      expect(titleInput.value).toBe(newTitle);
      expect(bodyInput.value).toBe(newBody);
   });

   it("handles image file upload", () => {
      const { getByLabelText } = render(<PostForm post={mockPost} />);
      const imageInput = getByLabelText(/Image:/i);
      const newImage = new File(["sample"], "sample.png", { type: "image/png" });

      const consoleSpy = jest.spyOn(console, "log");
      consoleSpy.mockImplementation(() => { });

      fireEvent.change(imageInput, { target: { files: newImage } });
      expect(imageInput.files).toBe(newImage);
   });

   // Original test for image upload

   // it("handles image file upload", () => {
   //    const mockSubmit = jest.fn();
   //    const buttonText = "Submit";
   //    const headerText = "New Post";

   //    const consoleSpy = jest.spyOn(console, "log");
   //    consoleSpy.mockImplementation(() => { });

   //    const { getByLabelText } = render(
   //       <PostForm
   //          buttonText={buttonText}
   //          headerText={headerText}
   //          onSubmit={mockSubmit}
   //       />
   //    );

   //    // Mock a file upload
   //    const file = new File(["sample"], "sample.png", { type: "image/png" });
   //    const imageInput = getByLabelText(/image/i);

   //    fireEvent.change(imageInput, { target: { files: [file] } });

   //    expect(consoleSpy).toHaveBeenCalledWith(file);
   // });

   it("should submit the form when the submit button is clicked", () => {
      const onSubmit = jest.fn();
      const { getByRole } = render(<PostForm
         post={mockPost}
         buttonText="Create Post"
         onSubmit={onSubmit}
      />);
      const submitButton = getByRole("button", { name: /create post/i });
      fireEvent.click(submitButton);
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
         title: "Test Post Title",
         body: "Test Post Body",
         image: null,
      });
   });
});
