import { z } from "zod";

export const messageSchema = z.string().min(7, "Message should be minimum 7 characters").max(50, "Message must not be more than 50 characters");
