import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.email(),
  password: z.string().min(8, 'At least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const register = useRegister()
  const navigate = useNavigate()
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Collectors</p>
      <h1 className="mt-2 font-display text-5xl">Register</h1>
      <form
        className="mt-10 space-y-8"
        onSubmit={form.handleSubmit((values) => {
          register.mutate(values, { onSuccess: () => navigate('/') })
        })}
      >
        <Input label="Full name" {...form.register('fullName')} error={form.formState.errors.fullName?.message} />
        <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input label="Password" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        <Button type="submit" disabled={register.isPending} className="w-full">
          {register.isPending ? 'Please wait' : 'Create account'}
        </Button>
      </form>
      <p className="mt-8 text-sm text-stone">
        Already a member?{' '}
        <Link to="/login" className="text-charcoal underline decoration-muted-gold/40 underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
