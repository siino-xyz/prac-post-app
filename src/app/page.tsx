"use client";

import axios from "axios";
import AddPost from "../components/AddPost";
import Post from "../components/Post";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/types/Posts";

// fetch all posts
const allPosts = async () => {
  const response = await axios
    .get("/api/posts/getPosts")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("エラー");
    });
  return response;
};

const Home = () => {
  const { data, error, isLoading } = useQuery<
    PostType[]
  >({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (error) return error;
  if (isLoading) return "Loading....";
  return (
    <main>
      <AddPost />
      {data?.map((post) => (
        <Post
          comments={post.Comment}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
        />
      ))}
    </main>
  );
};

export default Home;
