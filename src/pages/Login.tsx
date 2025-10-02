import { useActionState } from "react";
import { Header } from "../components/Header";
import { useLoginMutation } from "../hooks/useLoginMutation";

export function Login() {
  // Custom hook encapsulates login mutation logic + cache population
  const loginMutation = useLoginMutation();

  // Use useActionState for form handling (React 19 feature)
  // Integrate with useMutation for caching benefits
  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        // Trigger the mutation and wait for it
        await loginMutation.mutateAsync({ email, password });
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : "Login failed";
      }
    },
    null
  );

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header title='Please login' />

      <main className='flex-1 flex items-center justify-center'>
        <div className='border border-purple-600 bg-white rounded-lg px-16 py-12'>
          <form className='space-y-6' action={formAction} noValidate>
            {error && (
              <div
                id='login-error'
                role='alert'
                aria-live='assertive'
                className='bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm'
              >
                {error}
              </div>
            )}

            <div className='flex items-center gap-5'>
              <label htmlFor='email' className='w-36 text-right text-base'>
                Email address:
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                aria-required='true'
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "login-error" : undefined}
                disabled={isPending}
                className='w-80 px-3 py-2.5 border rounded-md border-gray-400 text-base focus:outline-none focus:border-purple-600 disabled:bg-gray-100'
              />
            </div>

            <div className='flex items-center gap-5'>
              <label htmlFor='password' className='w-36 text-right text-base'>
                Password:
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                aria-required='true'
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "login-error" : undefined}
                disabled={isPending}
                className='w-80 px-3 py-2.5 border rounded-md border-gray-400 text-base focus:outline-none focus:border-purple-600 disabled:bg-gray-100'
              />
            </div>

            <div className='flex justify-end pt-3'>
              <button
                type='submit'
                disabled={isPending}
                aria-busy={isPending}
                className='bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-12 py-3 rounded-md text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {isPending ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
