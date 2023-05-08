import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GhostContentAPI from "@tryghost/content-api";
import { format } from "date-fns";

let router;

export default function Post(props) {
  router = useRouter();
  function createMarkup() {
    return { __html: 
      props.post !== undefined &&
      props.post !== null
      ? props.post.html
      : null
    };
  }

  return (
    <main id="site-main" className="flex flex-col items-center site-main bg-white">
        <article className="post-full post flex flex-col items-center py-16">
          <header
            className="post-full-header pt-0 pb-8 text-center w-max-[40rem]"
          >
            <section className="post-full-tags">
              <a
                href={
                  props.post !== undefined &&
                  props.post !== null
                    ?
                    props.post.primary_tag !== undefined &&
                    props.post.primary_tag !== null
                      ? props.post.primary_tag.url
                      : null
                    : null
                }
              >
                {
                props.post !== undefined &&
                props.post !== null
                  ?
                  props.post.primary_tag !== undefined &&
                  props.post.primary_tag !== null
                    ? props.post.primary_tag.name
                    : null
                  : null
                }
              </a>
            </section>
            <h1 className="post-full-title font-bold text-xl mt-0 mb-2">
              {
                props.post !== undefined &&
                props.post !== null
                  ? props.post.title
                : null
              }
            </h1>
            <div className="text-xs text-neutral-500">
              {
                props.post !== undefined &&
                props.post !== null
                  ? format(new Date(props.post.published_at), "MMMM M, yyyy")
                : null
              }

            </div>
          </header>
          {
          props.post !== undefined &&
          props.post !== null
            ? props.post.feature_image : null !== null ? (
            <figure
              className="post-full-image w-full m-0 text-center mb-5"
              style={{ maxWidth: "75rem" }}
            >
              <img src={props.post.feature_image} alt={props.post.title} />
            </figure>
          ) : null}
          <section className="post-full-content">
            <div className="post-content">
              {
                <div
                  className="pb-4 py-3 leading-normal text-md"
                  style={{ maxWidth: "40rem" }}
                  dangerouslySetInnerHTML={createMarkup()}
                ></div>
              }
            </div>
          </section>
        </article>
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
    </main>
  );
}
export async function getServerSideProps(req) {
  const baseUrl = process.env.NEXT_SERVER_URL;
  const api = new GhostContentAPI({
    url: process.env.NEXT_SERVER_BLOG_URL,
    key: process.env.NEXT_SERVER_BLOG_KEY,
    version: "v3",
  });
  let post;
  const getPosts = async function () {
    return await api.posts.read({
      slug: req.query.slug,
    });
  };
  const posts = await getPosts()
    .then((res) => {
      post = res;
      //console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
  let serverDateTime = null;
  if (req) {
    serverDateTime = new Date();
  }
  const tumblr_posts_res = await fetch(`${baseUrl}/api/tumblr_posts`);
  const tumblr_posts = await tumblr_posts_res.json();
  return {
    props: {
      post: post,
      year: serverDateTime.getFullYear(),
      tumblr_posts: tumblr_posts,
    }
  };
};
