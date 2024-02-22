// package: create
// file: backend.proto

import * as jspb from "google-protobuf";

export class Gift extends jspb.Message {
  getStaffPassId(): string;
  setStaffPassId(value: string): void;

  getTeamName(): string;
  setTeamName(value: string): void;

  getTime(): string;
  setTime(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Gift.AsObject;
  static toObject(includeInstance: boolean, msg: Gift): Gift.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Gift, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Gift;
  static deserializeBinaryFromReader(message: Gift, reader: jspb.BinaryReader): Gift;
}

export namespace Gift {
  export type AsObject = {
    staffPassId: string,
    teamName: string,
    time: string,
  }
}

export class GetTeamRequest extends jspb.Message {
  getStaffPassId(): string;
  setStaffPassId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTeamRequest): GetTeamRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTeamRequest;
  static deserializeBinaryFromReader(message: GetTeamRequest, reader: jspb.BinaryReader): GetTeamRequest;
}

export namespace GetTeamRequest {
  export type AsObject = {
    staffPassId: string,
  }
}

export class GetTeamResponse extends jspb.Message {
  getGtresp(): string;
  setGtresp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTeamResponse): GetTeamResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTeamResponse;
  static deserializeBinaryFromReader(message: GetTeamResponse, reader: jspb.BinaryReader): GetTeamResponse;
}

export namespace GetTeamResponse {
  export type AsObject = {
    gtresp: string,
  }
}

export class GetGiftsRequest extends jspb.Message {
  getTeamName(): string;
  setTeamName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGiftsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGiftsRequest): GetGiftsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGiftsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGiftsRequest;
  static deserializeBinaryFromReader(message: GetGiftsRequest, reader: jspb.BinaryReader): GetGiftsRequest;
}

export namespace GetGiftsRequest {
  export type AsObject = {
    teamName: string,
  }
}

export class GetGiftsResponse extends jspb.Message {
  clearGiftList(): void;
  getGiftList(): Array<Gift>;
  setGiftList(value: Array<Gift>): void;
  addGift(value?: Gift, index?: number): Gift;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGiftsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetGiftsResponse): GetGiftsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGiftsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGiftsResponse;
  static deserializeBinaryFromReader(message: GetGiftsResponse, reader: jspb.BinaryReader): GetGiftsResponse;
}

export namespace GetGiftsResponse {
  export type AsObject = {
    giftList: Array<Gift.AsObject>,
  }
}

export class RedeemRequest extends jspb.Message {
  clearGiftList(): void;
  getGiftList(): Array<Gift>;
  setGiftList(value: Array<Gift>): void;
  addGift(value?: Gift, index?: number): Gift;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedeemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RedeemRequest): RedeemRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedeemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedeemRequest;
  static deserializeBinaryFromReader(message: RedeemRequest, reader: jspb.BinaryReader): RedeemRequest;
}

export namespace RedeemRequest {
  export type AsObject = {
    giftList: Array<Gift.AsObject>,
  }
}

export class RedeemResponse extends jspb.Message {
  getRresp(): string;
  setRresp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RedeemResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RedeemResponse): RedeemResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RedeemResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RedeemResponse;
  static deserializeBinaryFromReader(message: RedeemResponse, reader: jspb.BinaryReader): RedeemResponse;
}

export namespace RedeemResponse {
  export type AsObject = {
    rresp: string,
  }
}

export class HistoryRequest extends jspb.Message {
  getGetteamid(): string;
  setGetteamid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryRequest): HistoryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryRequest;
  static deserializeBinaryFromReader(message: HistoryRequest, reader: jspb.BinaryReader): HistoryRequest;
}

export namespace HistoryRequest {
  export type AsObject = {
    getteamid: string,
  }
}

export class HistoryResponse extends jspb.Message {
  getHresp(): string;
  setHresp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HistoryResponse): HistoryResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoryResponse;
  static deserializeBinaryFromReader(message: HistoryResponse, reader: jspb.BinaryReader): HistoryResponse;
}

export namespace HistoryResponse {
  export type AsObject = {
    hresp: string,
  }
}

export class UpdateCreateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCreateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCreateRequest): UpdateCreateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateCreateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCreateRequest;
  static deserializeBinaryFromReader(message: UpdateCreateRequest, reader: jspb.BinaryReader): UpdateCreateRequest;
}

export namespace UpdateCreateRequest {
  export type AsObject = {
  }
}

export class UpdateCreateResponse extends jspb.Message {
  getUcresp(): string;
  setUcresp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCreateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCreateResponse): UpdateCreateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateCreateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCreateResponse;
  static deserializeBinaryFromReader(message: UpdateCreateResponse, reader: jspb.BinaryReader): UpdateCreateResponse;
}

export namespace UpdateCreateResponse {
  export type AsObject = {
    ucresp: string,
  }
}

export class UpdateRedeemedRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRedeemedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRedeemedRequest): UpdateRedeemedRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateRedeemedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRedeemedRequest;
  static deserializeBinaryFromReader(message: UpdateRedeemedRequest, reader: jspb.BinaryReader): UpdateRedeemedRequest;
}

export namespace UpdateRedeemedRequest {
  export type AsObject = {
  }
}

export class UpdateRedeemedResponse extends jspb.Message {
  getUrresp(): string;
  setUrresp(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRedeemedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRedeemedResponse): UpdateRedeemedResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateRedeemedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRedeemedResponse;
  static deserializeBinaryFromReader(message: UpdateRedeemedResponse, reader: jspb.BinaryReader): UpdateRedeemedResponse;
}

export namespace UpdateRedeemedResponse {
  export type AsObject = {
    urresp: string,
  }
}

