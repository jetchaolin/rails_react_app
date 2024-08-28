class Api::V1::SearchController < ApplicationController
  def posts
    # If you're using a diffenrent DB, you might need to use ILIKE instead of LIKE
    # You can remove or keep the "%" in your query in order to define the tolerance of your search
    @posts = Post.where('title LIKE ? OR body LIKE ?', "%#{params[:q]}%", "%#{params[:q]}%").order(created_at: :desc)

    posts_with_images = @posts.map do |post|
      if post.image.attached?
        post.as_json.merge(image_url: url_for(post.image))
      else
        post.as_json.merge(image_url: nil)
      end
    end

    render json: posts_with_images
  end
end
