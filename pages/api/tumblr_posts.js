import load_tumblr_posts from "../../lib/load_tumblr_posts";

export default async (req, res) => {
  const tumblr_posts = await load_tumblr_posts();
  res.status(200).json(tumblr_posts);
};
