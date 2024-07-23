import { render, fireEvent, getByLabelText } from "@testing-library/react";
import PostForm from "./PostForm";


describe("PostForm component", () => {
   const mockPost = {
      title: "Test Post Title",
      body: "Test Post Body",
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
      fireEvent.change(titleInput, { target: { value: "New Title" } });
      fireEvent.change(bodyInput, { target: { value: "New Body" } });
      expect(titleInput.value).toBe("New Title");
      expect(bodyInput.value).toBe("New Body");
   });

   it("should submit the form when the submit button is clicked", () => {
      const onSubmit = jest.fn();
      const { getByRole } = render(<PostForm post={mockPost} buttonText="Create Post" onSubmit={onSubmit} />);
      const submitButton = getByRole("button", { name: /create post/i });
      fireEvent.click(submitButton);
      expect(onSubmit).toHaveBeenCalledTimes(1);
   });
});
