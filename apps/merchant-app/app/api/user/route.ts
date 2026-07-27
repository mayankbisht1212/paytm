import { NextResponse } from "next/server"
import db from "@repo/db/client";

const client = db;

export const GET = async () => {
    try {
        await client.user.create({
            data: {
                email: "asd",
                name: "adsads",
                number: Date.now().toString(),
                password: "secret"
            }
        })
        return NextResponse.json({ message: "hi there" })
    } catch (err: any) {
        return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
    }
}