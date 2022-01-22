import bcrypt from 'bcrypt'

import { db } from './db.server'
import { createCookieSessionStorage, redirect } from 'remix'

interface LoginParams  {username: string, password: string}

// Login user
export const login = async ({username, password}:LoginParams) => {
    const user = await db.user.findUnique({
        where: {
            username
        }
    })

    if(!user) return null

    // check password
    // const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
    const isCorrectPassword = password === user.passwordHash || await bcrypt.compare(password, user.passwordHash)


    if (!isCorrectPassword) return null
    
    return user
}

export const register = async({username, password}: LoginParams) => {
    const passwordHash = await bcrypt.hash(password, 10)

    return db.user.create({
        data: {
            username,
            passwordHash
        }
    })
}


// get session secret
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error(" no session secret ")
}

// create session storage
const storage = createCookieSessionStorage({
    cookie: {
        name: "remixblog_session",
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 60,
        httpOnly: true
    }
})


// create sessionSecret

export const createUserSession = async (userId: string, redirectTo: string) => {
    const session = await storage.getSession()
    session.set('userId', userId)
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session)
        }
    })

}

// get user session

export const getUserSession = (request: Request) => {
    return storage.getSession(request.headers.get('Cookie'))
}

// get loogged user


export const getUser = async (request: Request) => {
    const session = await getUserSession(request)
    const userId = session.get('userId')

    if (!userId || typeof userId !== 'string') {
        return null 
    }
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        })

        return user
    } catch (error) {
        return  null
    }
}

// logut user destroy session
export const logout = async (request: Request) => {
    const session = await storage.getSession(request.headers.get('Cookie'))

    return redirect('/auth/logout', {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    })
}