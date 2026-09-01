import { ObjectId } from "mongoose";

export interface T { // common type yani any
    [key: string]: any;
}

export interface StatisticModifier {
    _id: ObjectId;
    targetKey: string;
    modifier: number;
}