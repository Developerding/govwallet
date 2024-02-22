// GENERATED CODE -- DO NOT EDIT!

// package: create
// file: backend.proto

import * as backend_pb from "./backend_pb";
import * as grpc from "@grpc/grpc-js";

interface IbackendServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getTeam: grpc.MethodDefinition<backend_pb.GetTeamRequest, backend_pb.GetTeamResponse>;
  getGifts: grpc.MethodDefinition<backend_pb.GetGiftsRequest, backend_pb.GetGiftsResponse>;
  redeemGift: grpc.MethodDefinition<backend_pb.RedeemRequest, backend_pb.RedeemResponse>;
  checkHistory: grpc.MethodDefinition<backend_pb.HistoryRequest, backend_pb.HistoryResponse>;
  updateCreate: grpc.MethodDefinition<backend_pb.UpdateCreateRequest, backend_pb.UpdateCreateResponse>;
  updateRedeemed: grpc.MethodDefinition<backend_pb.UpdateRedeemedRequest, backend_pb.UpdateRedeemedResponse>;
}

export const backendServiceService: IbackendServiceService;

export interface IbackendServiceServer extends grpc.UntypedServiceImplementation {
  getTeam: grpc.handleUnaryCall<backend_pb.GetTeamRequest, backend_pb.GetTeamResponse>;
  getGifts: grpc.handleUnaryCall<backend_pb.GetGiftsRequest, backend_pb.GetGiftsResponse>;
  redeemGift: grpc.handleUnaryCall<backend_pb.RedeemRequest, backend_pb.RedeemResponse>;
  checkHistory: grpc.handleUnaryCall<backend_pb.HistoryRequest, backend_pb.HistoryResponse>;
  updateCreate: grpc.handleUnaryCall<backend_pb.UpdateCreateRequest, backend_pb.UpdateCreateResponse>;
  updateRedeemed: grpc.handleUnaryCall<backend_pb.UpdateRedeemedRequest, backend_pb.UpdateRedeemedResponse>;
}

export class backendServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getTeam(argument: backend_pb.GetTeamRequest, callback: grpc.requestCallback<backend_pb.GetTeamResponse>): grpc.ClientUnaryCall;
  getTeam(argument: backend_pb.GetTeamRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.GetTeamResponse>): grpc.ClientUnaryCall;
  getTeam(argument: backend_pb.GetTeamRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.GetTeamResponse>): grpc.ClientUnaryCall;
  getGifts(argument: backend_pb.GetGiftsRequest, callback: grpc.requestCallback<backend_pb.GetGiftsResponse>): grpc.ClientUnaryCall;
  getGifts(argument: backend_pb.GetGiftsRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.GetGiftsResponse>): grpc.ClientUnaryCall;
  getGifts(argument: backend_pb.GetGiftsRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.GetGiftsResponse>): grpc.ClientUnaryCall;
  redeemGift(argument: backend_pb.RedeemRequest, callback: grpc.requestCallback<backend_pb.RedeemResponse>): grpc.ClientUnaryCall;
  redeemGift(argument: backend_pb.RedeemRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.RedeemResponse>): grpc.ClientUnaryCall;
  redeemGift(argument: backend_pb.RedeemRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.RedeemResponse>): grpc.ClientUnaryCall;
  checkHistory(argument: backend_pb.HistoryRequest, callback: grpc.requestCallback<backend_pb.HistoryResponse>): grpc.ClientUnaryCall;
  checkHistory(argument: backend_pb.HistoryRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.HistoryResponse>): grpc.ClientUnaryCall;
  checkHistory(argument: backend_pb.HistoryRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.HistoryResponse>): grpc.ClientUnaryCall;
  updateCreate(argument: backend_pb.UpdateCreateRequest, callback: grpc.requestCallback<backend_pb.UpdateCreateResponse>): grpc.ClientUnaryCall;
  updateCreate(argument: backend_pb.UpdateCreateRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.UpdateCreateResponse>): grpc.ClientUnaryCall;
  updateCreate(argument: backend_pb.UpdateCreateRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.UpdateCreateResponse>): grpc.ClientUnaryCall;
  updateRedeemed(argument: backend_pb.UpdateRedeemedRequest, callback: grpc.requestCallback<backend_pb.UpdateRedeemedResponse>): grpc.ClientUnaryCall;
  updateRedeemed(argument: backend_pb.UpdateRedeemedRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.UpdateRedeemedResponse>): grpc.ClientUnaryCall;
  updateRedeemed(argument: backend_pb.UpdateRedeemedRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<backend_pb.UpdateRedeemedResponse>): grpc.ClientUnaryCall;
}
