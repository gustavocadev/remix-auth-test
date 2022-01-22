import { Form, ActionFunction, json, redirect, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { login, register } from "~/utils/session.server";
import { createUserSession } from "../../utils/session.server";

const badRequest = (data: any) => {
    return json(data, { status: 400 });
};

const validateUsername = (title: string) => {
    if (typeof title !== "string") {
        return "Ttitle shoud be a string";
    }
};

const validatePassword = (body: string) => {
    if (typeof body !== "string") {
        return "Ttitle shoud be a string";
    }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const loginType = formData.get("loginType") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const fields = { loginType, username, password };

    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        // console.log(fieldErrors);
        return badRequest({ fieldErrors, fields });
    }
    console.log(loginType);
    switch (loginType) {
        case "login": {
            // find User
            const user = await login({ username, password });
            // check User
            if (!user) {
                return badRequest({
                    fields,
                    fieldsErrors: { username: "invalid credentials" },
                });
            }
            // create usersession
            console.log("hi");
            return createUserSession(user.id, "/posts");
        }
        case "register": {
            // Check if user exists
            const userExists = await db.user.findFirst({
                where: { username },
            });

            if (userExists) {
                return badRequest({
                    fields,
                    fieldsErrors: { username: "Username is already exists" },
                });
            }
            // Create User
            const user = await register({ username, password });

            if (!user) {
                return badRequest({
                    fields,
                    formError: "something went wrong",
                });
            }

            // Create user Session

            return createUserSession(user.id, "/posts");
        }

        default: {
            return badRequest({ fields, formError: "Login type is not valid" });
        }
    }
};

export default function Login() {
    const actionData = useActionData();
    return (
        <div>
            <section className="text-blueGray-700">
                <div className="container items-center px-5 py-12 lg:px-20">
                    <div
                        className="
            flex flex-col
            w-full
            max-w-md
            p-10
            mx-auto
            my-6
            transition
            duration-500
            ease-in-out
            transform
            bg-white
            rounded-lg
            md:mt-0
          "
                    >
                        <div className="mt-8">
                            <div className="mt-6">
                                <Form method="post" className="space-y-6">
                                    <legend>Login o register</legend>
                                    <label htmlFor="login" className="px-12">
                                        <input
                                            type="radio"
                                            name="loginType"
                                            value="login"
                                            id="login"
                                            defaultChecked={true}
                                        />{" "}
                                        Login
                                    </label>
                                    <label htmlFor="register">
                                        <input
                                            type="radio"
                                            name="loginType"
                                            value="register"
                                            id="register"
                                        />{" "}
                                        Register
                                    </label>
                                    <div>
                                        <label
                                            htmlFor="username"
                                            className="block text-sm font-medium text-neutral-600"
                                        >
                                            Username
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Your Username"
                                                className="
                        block
                        w-full
                        px-5
                        py-3
                        text-base text-neutral-600
                        placeholder-gray-300
                        transition
                        duration-500
                        ease-in-out
                        transform
                        border border-transparent
                        rounded-lg
                        bg-gray-50
                        focus:outline-none
                        focus:border-transparent
                        focus:ring-2
                        focus:ring-white
                        focus:ring-offset-2
                        focus:ring-offset-gray-300
                      "
                                            />
                                            <span>
                                                {
                                                    actionData?.fieldErrors
                                                        ?.username
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-neutral-600"
                                        >
                                            {" "}
                                            Password{" "}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="text"
                                                autoComplete="current-password"
                                                placeholder="Your Password"
                                                className="
                        block
                        w-full
                        px-5
                        py-3
                        text-base text-neutral-600
                        placeholder-gray-300
                        transition
                        duration-500
                        ease-in-out
                        transform
                        border border-transparent
                        rounded-lg
                        bg-gray-50
                        focus:outline-none
                        focus:border-transparent
                        focus:ring-2
                        focus:ring-white
                        focus:ring-offset-2
                        focus:ring-offset-gray-300
                      "
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                placeholder="Your password"
                                                className="
                        w-4
                        h-4
                        text-blue-600
                        border-gray-200
                        rounded
                        focus:ring-blue-500
                      "
                                            />
                                            <span>
                                                {
                                                    actionData?.fieldErrors
                                                        ?.password
                                                }
                                            </span>
                                            <label
                                                htmlFor="remember-me"
                                                className="block ml-2 text-sm text-neutral-600"
                                            >
                                                {" "}
                                                Remember me{" "}
                                            </label>
                                        </div>
                                        <div className="text-sm">
                                            <a
                                                href="#"
                                                className="font-medium text-blue-600 hover:text-blue-500"
                                            >
                                                {" "}
                                                Forgot your password?{" "}
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="
                      flex
                      items-center
                      justify-center
                      w-full
                      px-10
                      py-4
                      text-base
                      font-medium
                      text-center text-white
                      transition
                      duration-500
                      ease-in-out
                      transform
                      bg-blue-600
                      rounded-xl
                      hover:bg-blue-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-blue-500
                    "
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
