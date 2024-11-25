import Client from '../Client';
export interface Button {
    id: string;
    run: ButtonRun;
}

interface ButtonRun {
    (client: Client, ...args: any[]);
}
