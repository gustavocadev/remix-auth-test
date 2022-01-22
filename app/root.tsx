import {
    Links,
    LiveReload,
    Meta,
    useLoaderData,
    Outlet,
    Scripts,
    ScrollRestoration,
    Form,
} from "remix";
import type { MetaFunction } from "remix";
import { Link } from "react-router-dom";
import { getUser } from "./utils/session.server";
import { LoaderFunction } from "remix";

export const meta: MetaFunction = () => {
    return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    const data = {
        user,
    };

    return data;
};

export default function App() {
    const { user } = useLoaderData();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <nav>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>
                    {user ? (
                        <Form action="/auth/logout" method="post">
                            <button type="submit">
                                Logout {user.username}
                            </button>
                        </Form>
                    ) : (
                        <li>
                            <Link to="/auth/login">Login</Link>
                        </li>
                    )}
                </nav>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    );
}
