import GhostContentAPI from "@tryghost/content-api";
import load_posts from "../lib/load_posts";

export default async (req, res) => {
  const posts = await load_posts();
  res.status(200).json(posts);
};