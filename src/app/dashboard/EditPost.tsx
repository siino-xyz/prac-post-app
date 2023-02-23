"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import toast from "react-hot-toast";
import Link from "next/link";

export type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  comments?: {
    createdAt: string;
    id: string;
    postId: string;
    userId: string;
  }[];
};

const EditPost = ({
  avatar,
  name,
  title,
  comments,
  id,
}: EditProps) => {
  //Toggle
  const [toggle, setToggle] = useState(false);
  let deleteToastID: string;
  const queryClient = useQueryClient();
  //Delete Post
  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/posts/deletePost", {
        data: id,
      }),
    {
      onError: (error) => {
        console.log(error);
        toast.error("Error deleting that post", {
          id: deleteToastID,
        });
      },
      onSuccess: (data) => {
        toast.success("Post has been deleted", {
          id: deleteToastID,
        });
        queryClient.invalidateQueries(["auth-posts"]);
      },
    }
  );

  const deletePost = () => {
    mutate(id);
  };
  return (
    <>
      <div className="bg-white my-8 p-8 rounded-lg">
        <div>
          <Image
            width={32}
            height={32}
            src={avatar}
            alt="avater"
          />
          <h3 className="font-bold text-gray-700">
            {name}
          </h3>
        </div>
        <div className="my-8">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/post/${id}`}>
            <p className="text-sm font-bold text-gray-700">
              {comments?.length} Comments
            </p>
          </Link>
          <button
            onClick={(e) => {
              setToggle(true);
            }}
            className="text-sm font-bold text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      {toggle && (
        <Toggle
          deletePost={deletePost}
          setToggle={setToggle}
        />
      )}
    </>
  );
};

export default EditPost;
