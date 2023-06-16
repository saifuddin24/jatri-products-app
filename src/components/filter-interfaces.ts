export interface MinMaxInterface {
    min:number;
    max:number;
}

export interface FilterInterface<T = any>  {
    type?:string;
    key:string;
    value: T;
}