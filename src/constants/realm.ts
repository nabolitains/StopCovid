import Realm from 'realm';

export interface MyUuid{    
    uuid:string
    time:number
}
export interface Contact {
    uuid:string
    timestamps:number
    distance?:string
    rssi?:string
    deviceName?:string    
    uploader?:string
}

export interface Localisation {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    timestamp: number;
    speed: number;
    heading: number;
    isFromMockProvider: boolean;
}
export interface User{
    uid?:string
    localisation?:Array<Localisation>
    contact?:Array<Contact>
    myUUIDArray?:Array<MyUuid>
}

export class LocalisationShema {
    public static schema: Realm.ObjectSchema 
}
LocalisationShema.schema = {
    name:'Localisation',
    properties:{
        latitude: 'string',
        longitude: 'string',
        accuracy: 'string',
        altitude: 'string',
        timestamp: 'string',
        speed: 'string',
        heading: 'string',
        isFromMockProvider: 'bool'
    }
}

export class ContactShema {
    public static schema: Realm.ObjectSchema 
}
ContactShema.schema = {
    name:'Contact',
    properties:{
        uuid:'string',
        timestamps:'string',
        distance:'string?',
        rssi:'string?',
        deviceName:'string?',
        uploader:'string?'
    }
}

export class MyUuidShema {
    public static schema: Realm.ObjectSchema 
}
MyUuidShema.schema = { 
    name:'MyUuid',
    properties:{
        uuid:"string",
        time:'string'
    }
}

export class UserShema {
    public static schema: Realm.ObjectSchema 
    public uid:string
    public localisation?:Array<Localisation>
    public contact?:Array<Contact>
    public myUUIDArray?:Array<MyUuid>
}
UserShema.schema = {
    name:'User',
    properties:{
        uid:{ type: 'string', indexed: true, optional: false },
        localisation: {type: 'Localisation[]', optional: false},
        contact: {type:'Contact[]', optional: false},
        myUUIDArray: {type:"MyUuid[]", optional: false},
    }
}

let realm  = new Realm({schema: [UserShema,LocalisationShema,ContactShema,MyUuidShema]})

export default realm 