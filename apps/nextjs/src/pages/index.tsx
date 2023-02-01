import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { signIn, signOut } from 'next-auth/react';

import { api, type RouterOutputs } from '~/utils/api';
import { NavigationMenuDemo } from '../components/NavigationMenuDemo';

const PostCard: React.FC<{
  post: RouterOutputs['post']['all'][number];
  onPostDelete?: () => void;
}> = ({ post, onPostDelete }) => {
  return (
    <div className="flex w-full max-w-2xl flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-[hsl(280,100%,70%)]">
          {post.title || <i>Untitled</i>}
        </h2>
        <p className="mt-2 text-sm">{post.content || <i>No content</i>}</p>
      </div>
      <div>
        <span
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={onPostDelete}
        >
          Delete
        </span>
      </div>
    </div>
  );
};

const CreatePostForm: React.FC = () => {
  const utils = api.useContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { mutate } = api.post.create.useMutation({
    async onSuccess() {
      setTitle('');
      setContent('');
      await utils.post.all.invalidate();
    },
  });

  return (
    <div className="flex w-[80vw] flex-col p-4 md:w-[60vw] xl:w-[35vw]">
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button
        className="rounded bg-pink-700 p-2 font-bold"
        onClick={() => {
          mutate({
            title,
            content,
          });
        }}
      >
        Create
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const postQuery = api.post.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => postQuery.refetch(),
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
          </h1>
          <AuthShowcase />

          <CreatePostForm />

          <NavigationMenuDemo />

          {postQuery.data ? (
            <div>
              {postQuery.data?.length === 0 ? (
                <span>There are no posts!</span>
              ) : (
                <div className="flex h-[40vh] w-[80vw] justify-center overflow-y-scroll px-4 text-2xl md:w-[60vw] xl:w-[35vw]">
                  <div className="flex w-full flex-col gap-4">
                    {postQuery.data?.map((p) => {
                      return (
                        <PostCard
                          key={p.id}
                          post={p}
                          onPostDelete={() => deletePostMutation.mutate(p.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading..</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = api.auth.getSession.useQuery();

  const { data: secretMessage } = api.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {session?.user && (
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};
