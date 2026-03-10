import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    // NOTE: Removed PrismaAdapter to avoid incompatibility with Prisma 7 driver adapters.
    // User creation and account linking are handled manually in the signIn callback.
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                // Check for admin credentials first
                const adminEmail = process.env.ADMIN_EMAIL || "admin@skuprovision.com";
                const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    // Check if admin user exists in DB
                    let adminUser = await prisma.user.findUnique({
                        where: { email: adminEmail },
                    });

                    if (!adminUser) {
                        // Create admin user on first login
                        const hashedPw = await bcrypt.hash(adminPassword, 12);
                        adminUser = await prisma.user.create({
                            data: {
                                email: adminEmail,
                                name: "Admin",
                                password: hashedPw,
                                role: "super_admin",
                                status: "active",
                            },
                        });
                    }

                    return {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        role: adminUser.role,
                        status: adminUser.status,
                        company_name: adminUser.companyName,
                        phone: adminUser.phone,
                    };
                }

                // Regular user login
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    company_name: user.companyName,
                    phone: user.phone,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Handle Google OAuth: manually create or find the user
            if (account?.provider === "google") {
                try {
                    const email = user.email;
                    if (!email) return false;

                    let dbUser = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!dbUser) {
                        // Create new user for Google sign-in
                        dbUser = await prisma.user.create({
                            data: {
                                email,
                                name: user.name || "User",
                                image: user.image,
                                role: "user",
                                status: "active",
                            },
                        });
                    } else {
                        // Update existing user's image if changed
                        if (user.image && user.image !== dbUser.image) {
                            await prisma.user.update({
                                where: { email },
                                data: { image: user.image, name: user.name || dbUser.name },
                            });
                        }
                    }

                    // Attach the DB user id to the user object for JWT
                    user.id = dbUser.id;
                    (user as any).role = dbUser.role;
                    (user as any).status = dbUser.status;
                    (user as any).company_name = dbUser.companyName;
                    (user as any).phone = dbUser.phone;

                    return true;
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "user";
                token.status = (user as any).status || "active";
                token.company_name = (user as any).company_name || null;
                token.phone = (user as any).phone || null;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.status = token.status as string;
                session.user.company_name = (token.company_name as string) || null;
                session.user.phone = (token.phone as string) || null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to use in server components
export async function getAuthSession() {
    return await getServerSession(authOptions);
}

// For checking roles in server components
export async function hasRole(role: string): Promise<boolean> {
    const session = await getAuthSession();
    return session?.user?.role === role;
}

export async function isSuperAdmin(): Promise<boolean> {
    const session = await getAuthSession();
    return session?.user?.role === "super_admin";
}
