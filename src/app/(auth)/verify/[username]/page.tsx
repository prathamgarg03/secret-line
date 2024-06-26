import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifySchema>> ({
        resolver: zodResolver(verifySchema),
    })

  return (
    <div>VerifyAccount</div>
  )
}

export default VerifyAccount