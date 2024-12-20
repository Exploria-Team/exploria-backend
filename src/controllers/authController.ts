import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import { signUpSchema } from "../schema/users";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    try {
        signUpSchema.parse(req.body);
        const { email, password, name } = req.body;

        let user = await prisma.user.findFirst({
            where: { email },
        });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
            },
        });

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Invalid parameters" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
        return res.status(400).json({ message: "Account Not Found" });
    }
    if (!compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
        {
            userId: user.id,
        },
        JWT_SECRET
    );

    res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json(user);
};
