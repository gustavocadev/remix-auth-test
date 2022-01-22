import {
    ActionFunction,
    Form,
    Link,
    redirect,
    useActionData,
    json,
} from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
// import Post from './$postId';
type Post = {
    id?: string;
    title: string;
    body: string;
    createdAt?: Date;
    updatedAt?: Date;
};

const validateTitle = (title: string) => {
    if (typeof title !== "string" || title.length < 3) {
        return "Ttitle shoud be at 3 characters long";
    }
};

const validateBody = (body: string) => {
    if (typeof body !== "string" || body.length < 10) {
        return "Ttitle shoud be at 10 characters long";
    }
};

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const title = form.get("title") as string;
    const body = form.get("body") as string;
    const user = await getUser(request);

    const fields = { title, body };

    if (!fields) {
        return;
    }

    const newPost = {
        data: { ...fields, userId: user.id },
    };

    const fieldErrors = {
        title: validateTitle(title),
        body: validateBody(body),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        // console.log(fieldErrors);
        return json({ fieldErrors, fields }, { status: 400 });
    }

    const post = await db.post.create(newPost);

    return redirect(`/posts`);
};

export default function NewPost() {
    const actionData = useActionData();
    console.log(actionData);
    return (
        <main className="container mx-auto">
            <h1 className="my-4 text-4xl">New Post</h1>
            <section className="my-4 flex justify-end">
                <Link
                    to="/posts"
                    className="py-2 px-4 bg-black text-white rounded "
                >
                    back
                </Link>
            </section>
            <section>
                <Form method="post">
                    <label htmlFor="" className="block">
                        <span className="block">Title</span>
                        <input
                            type="text"
                            name="title"
                            className="p-2 border border-black rouned"
                        />
                        <span>{actionData?.fieldErrors?.title}</span>
                    </label>
                    <label htmlFor="" className="block">
                        <span className="block">Post Body</span>
                        <textarea
                            name="body"
                            id=""
                            cols={30}
                            rows={10}
                            className="border border-black rounded"
                        ></textarea>
                        <span>{actionData?.fieldErrors?.body}</span>
                    </label>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-black text-white rounded "
                    >
                        Submit
                    </button>
                </Form>
            </section>
        </main>
    );
}
export function ErrorBoundary({ error }: { error: Error }) {
    console.log(error);

    return (
        <main className="container mx-auto">
            <h1 className="my-4 text-4xl">Error</h1>
            <section className="my-4 flex justify-end">
                <Link
                    to="/posts"
                    className="py-2 px-4 bg-black text-white rounded "
                >
                    back
                </Link>
            </section>
            <section>
                <p>{error.message} 😢</p>
            </section>
        </main>
    );
}
