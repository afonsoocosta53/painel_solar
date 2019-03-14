import { Request } from "express"

export interface UserInterface extends Request {
    fields: any
}