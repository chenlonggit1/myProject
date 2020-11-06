import { Socket } from "./Socket";
import { PacketBuffer } from "./PacketBuffer";

export class ClientSocket extends Socket 
{
    public static ClassName: string = "ClientSocket";
    public buffer: PacketBuffer = null;//new PacketBuffer();
    protected serverHost: string;
    public connectByUrl(url: string): void 
    {
        this.serverHost = url;
        this.reconnect();
    }
    public reconnect(): void {
        if (this.connected) this.close();
        if (this.serverHost == null || this.serverHost == "") return;
        setTimeout(() => super.connectByUrl(this.serverHost), 1);
    }
    protected onSocketGetData(data: any): void {
        if (data) 
        {
            if(this.buffer)
            {
                // if(data instanceof ArrayBuffer)this.buffer.push(data);
                // else this.buffer.push(new Uint8Array(data));
                this.buffer.push(new Uint8Array(data));
                data = this.buffer.packetBytes;
            }
            super.onSocketGetData(data);
        }
    }
    public send(byte: any): void 
    {
        if (byte == null) return;
        super.send(byte);
    }
    public close(): void 
    {
        super.close();
        this.buffer&&this.buffer.clear();
    }
    public dispose(): void {
        super.dispose();
        this.buffer = null;
    }
    public get socketBytes(): Array<number> 
    {
        if(!this.buffer)return null;
        return this.buffer.packetBytes; 
    }
    public set socketBytes(value:Array<number>) { this.buffer&&(this.buffer.packetBytes = value); }
}