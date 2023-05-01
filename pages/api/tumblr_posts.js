const tumblr = require('tumblr.js');

var client = tumblr.createClient({
  consumer_key: process.env.NEXT_SERVER_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.NEXT_SERVER_TUMBLR_CONSUMER_SECRET,
  token: process.env.NEXT_SERVER_TUMBLR_TOKEN,
  token_secret: process.env.NEXT_SERVER_TUMBLR_TOKEN_SECRET
});

export default async (req, res) => {
  return await client.blogPosts('jayaresee', function(err, resp) {
    (resp !== null && resp !== undefined) ? 
    res.status(200).json(resp.posts) : null;
  });
};