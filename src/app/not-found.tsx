import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-mono text-mint">$ cd /this-page</p>
      <h1 className="mt-3 text-4xl font-bold">404: no such file or directory</h1>
      <p className="mt-3 text-muted">That page does not exist, or it moved.</p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </div>
  );
}
