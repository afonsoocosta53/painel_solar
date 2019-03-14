import { Request } from "express"

export interface QuestionInterface extends Request {
    fields: any
}