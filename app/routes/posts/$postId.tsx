import {
  useParams,
  useLoaderData,
  LoaderFunction,
  Link,
  ActionFunction,
  redirect,
  Form,
} from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      throw new Error("Post not found");
    }
    await db.post.delete({
      where: { id: params.postId },
    });
    return redirect("/posts");
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) throw new Error("Post not found");

  const data = {
    post,
  };
  return data;
};

export default function Post() {
  const { post } = useLoaderData();
  console.log(post);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Title: {post.title}</h1>
      <Link to="/posts" className="py-2 px-4 bg-black text-white rounded ">
        Back
      </Link>
      <p></p>
      <h2 className="text-3xl font-semibold">Your content:</h2>
      <section>{post.body}</section>

      <section>
        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button className="py-2 px-4 bg-red-700 text-white rounded ">
            Delete
          </button>
        </Form>
      </section>
    </div>
  );
}
