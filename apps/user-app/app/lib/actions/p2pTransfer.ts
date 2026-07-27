"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";
import { data } from "react-router-dom";
import { timeStamp } from "console";

type TransferResult =
    | { success: true }
    | { success: false; reason: string };

export async function p2pTransfer(to: string, amount: number): Promise<TransferResult> {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id
    if(!from){
        return {
            success: false,
            reason: "You need to sign in before sending money.",
        }
    }
    if (!Number.isFinite(amount) || amount <= 0) {
        return { success: false, reason: "Enter a valid amount greater than zero." };
    }
    const toUser = await prisma.user.findFirst({
        where:{
            number: to
        }
    })
    if(!toUser){
        return {
            success: false,
            reason: "No account was found for that mobile number.",
        }
    }
    try {
    return await prisma.$transaction(async (tx)=>{
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`
        const fromBalance = await tx.balance.findFirst({
            where:{
                userId: Number(from)
            }})
            if(!fromBalance || fromBalance.amount<amount){
                return {
                    success: false,
                    reason: "Your available balance is not enough for this transfer.",
                }
            }

            await tx.balance.update({
                where:{
                    userId: Number(from)
                },
                data:{
                    amount:{
                        decrement: Number(amount)
                    }
                }
            })

            await tx.balance.update({
                where:{
                    userId: toUser.id
                },
                data:{
                    amount:{
                        increment: Number(amount)
                    }
                }
            })
            await tx.p2pTransfer.create({
                data:{
                    
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timeStamp: new Date() 

                }
            })
            return { success: true };
    })
    } catch {
        return {
            success: false,
            reason: "We could not complete this transfer. Please try again.",
        };
    }
}
