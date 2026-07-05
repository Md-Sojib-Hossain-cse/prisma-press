import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateComment {
    content : string;
    postId : string;
    status ?: CommentStatus;
}