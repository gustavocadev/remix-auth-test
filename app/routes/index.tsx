import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = () => {
  return {};
};

export default function Index() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
