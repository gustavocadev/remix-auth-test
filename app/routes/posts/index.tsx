import { LoaderFunction, useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Data = {
  posts: {
    take: number;
    select: {
      id: boolean;
      title: boolean;
      body: boolean;
    };
    orderBy: {
      createdAt: string;
    };
  };
};

export const loader: LoaderFunction = async () => {
  console.log(133, "loader");

  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  };
  return data;
};

export default function Posts() {
  const { posts }: { posts: Post[] } = useLoaderData();
  return (
    <main className="container mx-auto">
      <h1 className="text-4xl my-4">Post</h1>
      <section className="my-4 ">
        <Link
          to="/posts/new"
          className="py-2 px-4 bg-black text-white rounded "
        >
          New Post
        </Link>
      </section>

      <section>
        {posts.map((post: Post) => (
          <div key={post.id} className="border border-black p-4 my-4">
            <Link to={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              {post.createdAt && (
                <p>{new Date(post.createdAt).toLocaleString()}</p>
              )}
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
