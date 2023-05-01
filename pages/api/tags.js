import GhostContentAPI from "@tryghost/content-api"
export default async(req, res) => {
  const api = new GhostContentAPI({
    url: process.env.NEXT_SERVER_BLOG_URL,
    key: process.env.NEXT_SERVER_BLOG_KEY,
    version: "v3"
  });
  const getTags = async function() {
    return await api.tags
      .browse()
      .catch(err => {
        console.error(err);
      });
  }
  const tags = await getTags();
  res.status(200).json(tags)
}