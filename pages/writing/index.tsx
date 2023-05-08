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

const Writing = (props: any) => {
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
        <li key={post.id} className="list-item-title w-[22rem] lg:w-[32rem] px-3 text-lg border-b-2">
          <Link href={`/writing/[slug]`} as={`/writing/${post.slug}`}>
            <div className="flex justify-between">
              <span className="py-3 max-w-5 leading-normal">
                {post.title}
              </span>
              <span className="py-3 mt-1 text-neutral-500 text-xs leading-normal">
                {format(new Date(post.published_at), "MMMM Mo")}
              </span>
            </div>
          </Link>
        </li>
      );
    });

    return (
      <div className="" key={group.group_published_at_month}>
        <h2 className="border-b-2 border-neutral-500 font-semibold text-center text-xs text-neutral-500 pb-1 mx-0">
          {postsGroupYear}
        </h2>
        <ul className="px-0 my-0 text-lg">{postsList}</ul>
      </div>
    );
  });

  return (
    <>
      <main>
        <div className="writing bg-white flex flex-col items-center">
          {props.tags.length > 0 ? (
            <div className="tags-wrap tc mt4 mb3">
                <ul className="tags dib list mv0 pl0">{tagsList}</ul>
            </div>
          ) : null}
          <div
            className="posts flex justify-center py-16 max-w-[64rem]"
            style={{ maxWidth: "32rem" }}
          >
            <div className="">
              <div className="w-full">{posts}</div>
            </div>
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
  
  const tags_res = await fetch(`${baseUrl}/api/tags`);
  const tags = await tags_res.json();

  return {
    props: {
      posts: postsGrouped,
      year: serverDateTime.getFullYear(),
      tags: tags,
      tumblr_posts: tumblr_posts,
    }
  };
};

export default Writing;
