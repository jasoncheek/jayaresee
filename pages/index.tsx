import Link from 'next/link'
import { format } from "date-fns";
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import getRandomIndex from '../helpers/getRandomIndex';
import load_posts from '../lib/load_posts';
import load_tumblr_posts from '../lib/load_tumblr_posts';

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

  const router = useRouter()
  if (!router.isFallback && !props) {
      return <ErrorPage statusCode={404} />
  }
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

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_SERVER_URL;
  const posts = await load_posts().then(json => {return json});
  const tumblr_posts_res = await load_tumblr_posts().then(json => {return json}); 
  const tumblr_posts = tumblr_posts_res.posts !== null && tumblr_posts_res.posts !== undefined ? tumblr_posts_res.posts : [];
  
  // const spotify_data_res = await fetch(`${baseUrl}/api/spotify_data`);
  // const spotify_data = await spotify_data_res.json();

  // const tweet_res = await fetch(`${baseUrl}/api/tweet`);
  // const tweet = await tweet_res.json();

  return {
    props: {
      posts: posts,
      //year: serverDateTime.getFullYear(),
      tumblr_posts: tumblr_posts
    }
    // spotify_data: spotify_data,
    // ig_post: ig_post,
    // tweet: tweet,
  };
};