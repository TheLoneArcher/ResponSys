import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  let role = 'volunteer';
  let profile = null;

  if (user) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('*, volunteers(is_available)')
      .eq('id', user.id)
      .single()
    
    if (prof) {
      role = prof.role
      profile = {
        ...prof,
        is_available: prof.volunteers?.[0]?.is_available ?? false
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0A0E17]">
      <Sidebar role={role} profile={profile} />
      <main className="flex-1 md:ml-[220px] min-w-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
