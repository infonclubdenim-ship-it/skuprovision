import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            status: string
            company_name?: string | null
            phone?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        status: string
        company_name?: string | null
        phone?: string | null
    }
}
