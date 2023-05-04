import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
//import { Link } from 'next/link'
import GhostContentAPI from "@tryghost/content-api";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { library } from "@fortawesome/fontawesome-svg-core";
//import { faTimes, faEnvelope } from "@fortawesome/free-solid-svg-icons";
//import { fab } from "@fortawesome/free-brands-svg-icons";
//import postStyles from "../../components/styled/postStyles.js";
import { parse, format } from "date-fns";
import getRandomIndex from "../../helpers/getRandomIndex";

//library.add(fab, faTimes, faEnvelope);
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

  const random_post_index = getRandomIndex(props.tumblr_posts.length);
  const tumblr_post = props.tumblr_posts !== null && props.tumblr_posts !==undefined ? props.tumblr_posts[random_post_index] : null;
  const image = tumblr_post.photos !== undefined && tumblr_post.photos.length > 0 ? tumblr_post.photos[0].original_size : {};
  const imgURL = image.url;

  return (
    <main id="site-main" className="site-main bg-white">
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
              {/* <img srcSet={`${props.post.feature_image} 300w,
                                            ${props.post.feature_image} 600w,
                                            ${props.post.feature_image} 1000w,
                                            ${props.post.feature_image} 2000w" sizes="(max-width: 800px) 400px,
                                        (max-width: 1170px) 1170px,
                                            2000px" src="${props.post.feature_image}"`} alt={props.post.title} /> */}
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
        <div className="more-posts text-center flex justify-center" >
          <Link href={`/writing`}
            className="text-xs block text-neutral-500 px-3 py-3"
          >
              View More Posts
          </Link>
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
            background: imgURL !== undefined ? `url("${imgURL}") no-repeat top center fixed` : "url(https://64.media.tumblr.com/d82a88833605efd82a53b781c37913d9/b3648c69bb01eac5-89/s1280x1920/4ca1f55b97920660a290732857f841c8de887149.jpg) no-repeat top center fixed", 
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            display: "block", 
            height: "9rem"
          }} 
        >
        </div>
      </div>
    </main>
  );
}
export async function getServerSideProps(req) {
//Post.getInitialProps = async (req) => {
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
      tumblr_posts: tumblr_posts
    }
  };
};
