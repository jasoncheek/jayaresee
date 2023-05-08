import Link from 'next/link'
import { format } from "date-fns";
import getRandomIndex from '../helpers/getRandomIndex';

export default function Home(props: any) {
  const posts = props.posts.map((post: any) => {
    return (
      <li key={post.id} className="list-item-title w-[22rem] lg:w-[32rem] px-3 text-lg border-b-2">
        <Link href={`/writing/[slug]`} as={`/writing/${post.slug}`}>
          <div className="flex justify-between items-center">
            <span
              className="py-3 leading-normal"
            >
              {post.title}
            </span>
            <span className="text-right py-3 text-neutral-500 text-xs leading-normal">
              {format(new Date(post.published_at), "MMMM Mo")}
            </span>
          </div>
        </Link>
      </li>
    );
  });

  const random_post_index = getRandomIndex(props.tumblr_posts.length);
  const tumblr_post = props.tumblr_posts !== null && props.tumblr_posts !==undefined ? props.tumblr_posts[random_post_index] : null;
  const image = tumblr_post.photos !== undefined && tumblr_post.photos.length > 0 ? tumblr_post.photos[0].original_size : {};
  const imgURL = image.url;

  return (
    <main>
      <div className="home bg-white flex flex-col items-center">
        <div
          className="flex justify-center py-16 max-w-[64rem]"
        >
          <div className="">
            <div className="w-full">
              <ul className="px-0 my-0 text-lg">{posts}</ul>
            </div>
          </div>
        </div>
        <div
          className="flex justify-center rounded-t-lg bg-neutral-100 text-center more-posts"
        >
          <Link href={`/writing`}
            className="block text-xs py-3 px-5 link"
          >
            <span>
              View More Posts
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const baseUrl = process.env.NEXT_SERVER_URL;

  const posts_res = await fetch(`${baseUrl}/api/posts`);
  const posts = await posts_res.json();

  const tumblr_posts_res = await fetch(`${baseUrl}/api/tumblr_posts`);
  const tumblr_posts = await tumblr_posts_res.json();
  
  // const spotify_data_res = await fetch(`${baseUrl}/api/spotify_data`);
  // const spotify_data = await spotify_data_res.json();

  // const tweet_res = await fetch(`${baseUrl}/api/tweet`);
  // const tweet = await tweet_res.json();

  return {
    props: {
      // spotify_data: spotify_data,
      // ig_post: ig_post,
      // tweet: tweet,
      posts: posts,
      //year: serverDateTime.getFullYear(),
      tumblr_posts: tumblr_posts
    }
  };
};