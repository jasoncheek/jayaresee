import Link from 'next/link'
import { format } from "date-fns";
import getRandomIndex from '../helpers/getRandomIndex';

export default function Home(props: any) {
  const posts = props.posts.map((post: any) => {
    return (
      <li key={post.id} className="list-item-title px-3 text-lg border-b-2">
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
      <div className="home bg-white">
        <div
          className="cf py-16 max-w-[64rem]"
        >
          <div className="flex-ns center">
            <div className="w-100 center bw2 b--dark-gray">
              <ul className="list ph0 mv0 f4">{posts}</ul>
            </div>
          </div>
        </div>
        <div
          className="flex justify-center text-center more-posts"
        >
          <Link href={`/writing`}
            className="block text-xs text-neutral-500 py-3 px-3 link"
          >
            <span
              style={{ fontWeight: "normal", color: "#777" }}
            >
              View More Posts
            </span>
          </Link>
        </div>
      </div>
      <div className="jayaresee-tumblr">
        <a 
          href="https://jayaresee.tumblr.com" 
          target="_blank"
          className="jayaresee-tumblr-overlay"
        >
        </a>
        <div 
          style={{
            background: imgURL !== undefined ? `no-repeat top center fixed url("${imgURL}")` : "url(https://64.media.tumblr.com/d82a88833605efd82a53b781c37913d9/b3648c69bb01eac5-89/s1280x1920/4ca1f55b97920660a290732857f841c8de887149.jpg) no-repeat top center fixed", 
          }}
          className="block h-[9rem]" 
        >
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