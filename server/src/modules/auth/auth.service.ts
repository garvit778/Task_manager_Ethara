import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { signToken } from "../../utils/jwt.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  jobTitle: true,
  createdAt: true
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "MEMBER";
}) => {
  const password = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { ...data, password },
    select: publicUserSelect
  });

  return {
    user,
    token: signToken({ id: user.id, email: user.email, role: user.role })
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      jobTitle: user.jobTitle,
      createdAt: user.createdAt
    },
    token: signToken({ id: user.id, email: user.email, role: user.role })
  };
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
  if (!user) throw new ApiError(404, "User not found.");
  return user;
};
