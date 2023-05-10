const tumblr = require('tumblr.js');

const client = tumblr.createClient({
  credentials: {
    consumer_key: process.env.NEXT_SERVER_TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.NEXT_SERVER_TUMBLR_CONSUMER_SECRET,
    token: process.env.NEXT_SERVER_TUMBLR_TOKEN,
    token_secret: process.env.NEXT_SERVER_TUMBLR_TOKEN_SECRET
  },
  returnPromises: true
});

const load_tumblr_posts = async function() {
  const request = await client.blogPosts("jayaresee");
  return await request;
};

export default load_tumblr_posts;
