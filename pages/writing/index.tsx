import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, fromUnixTime, formatISO } from "date-fns";
import {
  groupBy as _groupBy,
  values as _values,
  mapValues as _mapValues,
  orderBy as _orderBy,
} from "lodash";
import format from "date-fns/format";
import getMonth from "date-fns/getMonth";
//import postStyles from '../components/styled/postStyles.js'
import getRandomIndex from "../../helpers/getRandomIndex";

const Writing = (props: any) => {
  const random_post_index = getRandomIndex(props.tumblr_posts.length);
  const tumblr_post = props.tumblr_posts !== null && props.tumblr_posts !==undefined ? props.tumblr_posts[random_post_index] : null;
  const image = tumblr_post.photos !== undefined && tumblr_post.photos.length > 0 ? tumblr_post.photos[0].original_size : {};
  const imgURL = image.url;

  const [selectedTags, setSelectedTags] = useState();
  const tagsList = props.tags.map((tag: any) => {
    return (
      <li
        className="tag mh1 pa2 f7 ba bw1 dib br3 pointer"
        title={tag.name}
        key={tag.id}
      >
        {tag.name}
      </li>
    );
  });

  const toArrayWithKey = (obj: any, keyAs: any) =>
    _values(
      _mapValues(obj, (value: any, key: any) => {
        value[keyAs] = key;
        return value;
      })
    );
  const postsGroupedArray = toArrayWithKey(
    props.posts,
    "group_published_at_month"
  );
  const postsGroupedSorted = _orderBy(
    postsGroupedArray,
    "group_published_at_month",
    "desc"
  );
  const posts = postsGroupedSorted.map((group: any) => {
    const postsGroupYear = group[0].published_at_year;
    const postsList = group.map((post: any) => {
      return (
        <li key={post.id} className="list-item-title w-100 ph3">
          <Link href={`/writing/[slug]`} as={`/writing/${post.slug}`}>
            <div>
              <span className="fl v-mid pv3 link mw5 mw-none-ns lh-copy mr2">
                {post.title}
              </span>
              <span className="fr pv3 mt1 light-silver f7 lh-copy">
                {format(new Date(post.published_at), "MMMM Mo")}
              </span>
            </div>
          </Link>
        </li>
      );
    });

    return (
      <div key={group.group_published_at_month}>
        <h2 className="tc f7 gray normal b--silver bb bw1 pb1 center mv0">
          {postsGroupYear}
        </h2>
        <ul className="list tc ph0 mt0 mb4 f5">{postsList}</ul>
      </div>
    );
  });

  return (
    <>
      <main id="site-main" className="writing site-main outer bg-white">
        <div className="inner">

          {props.tags.length > 0 ? (
            <div className="tags-wrap tc mt4 mb3">
                <ul className="tags dib list mv0 pl0">{tagsList}</ul>
            </div>
          ) : null}
          <div
            className="posts flex-ns pv6 center"
            style={{ maxWidth: "32rem" }}
          >
            <div className="flex-ns center w-100">
              <div className="w-100 bw2 b--dark-gray">{posts}</div>
            </div>
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
    </>
  );
};

export async function getStaticProps(req: any) {
//Writing.getInitialProps = async ({ req }) => {
  let serverDateTime = null;

  if (req) {
    serverDateTime = new Date();
  } else {
    serverDateTime = new Date();
  }

  const baseUrl = process.env.NEXT_SERVER_URL;

  const posts_res = await fetch(`${baseUrl}/api/posts`);
  const posts = await posts_res.json();
  const postsUpdated = posts.map((post:any) => {
    post.published_at_formatted = format(
      new Date(post.published_at),
      "MM/dd/yyyy"
    );
    const date = new Date(post.published_at); // 2009-11-10
    const year = new Date(post.published_at).getFullYear(); // 2009-11-10
    const month = date.toLocaleString("default", { month: "long" });
    post.published_at_month = month;
    post.published_at_year = year;
    return post;
  });
  const postsGrouped = _groupBy(postsUpdated, "published_at_year");

  const tumblr_posts_res = await fetch(`${baseUrl}/api/tumblr_posts`);
  const tumblr_posts = await tumblr_posts_res.json();
  
  // const ig_post_res = await fetch(`${baseUrl}/api/ig_post`);
  // const ig_post = await ig_post_res.json();

  // const spotify_data_res = await fetch(`${baseUrl}/api/spotify_data`);
  // const spotify_data = await spotify_data_res.json();

  // const tweet_res = await fetch(`${baseUrl}/api/tweet`);
  // const tweet = await tweet_res.json();

  const tags_res = await fetch(`${baseUrl}/api/tags`);
  const tags = await tags_res.json();

  return {
    props: {
      // spotify_data: spotify_data,
      // ig_post: ig_post,
      // tweet: tweet,
      posts: postsGrouped,
      year: serverDateTime.getFullYear(),
      tags: tags,
      tumblr_posts: tumblr_posts,
    }
  };
};

export default Writing;
