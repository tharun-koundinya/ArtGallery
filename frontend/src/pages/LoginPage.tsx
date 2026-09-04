import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const schema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Members</p>
      <h1 className="mt-2 font-display text-5xl">Sign in</h1>
      <form
        className="mt-10 space-y-8"
        onSubmit={form.handleSubmit((values) => {
          login.mutate(values, { onSuccess: () => navigate(from) })
        })}
      >
        <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input label="Password" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        <Button type="submit" disabled={login.isPending} className="w-full">
          {login.isPending ? 'Please wait' : 'Enter'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-stone">
        New collector?{' '}
        <Link to="/register" className="text-charcoal underline decoration-muted-gold/40 underline-offset-4">
          Create an account
        </Link>
      </p>
      <div className="mt-12 border-t border-charcoal/10 pt-6 text-[11px] leading-relaxed tracking-[0.08em] text-stone">
        <p className="uppercase tracking-[0.18em] text-charcoal">Demonstration</p>
        <p className="mt-3">owner@artgallery.com · Owner@12345</p>
        <p>artist@artgallery.com · Artist@12345</p>
        <p>collector@artgallery.com · Collector@12345</p>
      </div>
    </div>
  )
}
