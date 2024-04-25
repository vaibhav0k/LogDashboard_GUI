import { Timestamp } from "rxjs";

export class LogException { 
        id!:number;
        statusCode!: number;
        message!: string;
        stackTrace!: string;
        source!: string;
        severity!: string;
        applicationName!: string;
        timestamp!: Date;
}
