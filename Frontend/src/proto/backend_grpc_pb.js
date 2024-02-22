// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var backend_pb = require('../../../in-memory/proto/backend_pb.js');

function serialize_create_GetGiftsRequest(arg) {
  if (!(arg instanceof backend_pb.GetGiftsRequest)) {
    throw new Error('Expected argument of type create.GetGiftsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_GetGiftsRequest(buffer_arg) {
  return backend_pb.GetGiftsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_GetGiftsResponse(arg) {
  if (!(arg instanceof backend_pb.GetGiftsResponse)) {
    throw new Error('Expected argument of type create.GetGiftsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_GetGiftsResponse(buffer_arg) {
  return backend_pb.GetGiftsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_GetTeamRequest(arg) {
  if (!(arg instanceof backend_pb.GetTeamRequest)) {
    throw new Error('Expected argument of type create.GetTeamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_GetTeamRequest(buffer_arg) {
  return backend_pb.GetTeamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_GetTeamResponse(arg) {
  if (!(arg instanceof backend_pb.GetTeamResponse)) {
    throw new Error('Expected argument of type create.GetTeamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_GetTeamResponse(buffer_arg) {
  return backend_pb.GetTeamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_HistoryRequest(arg) {
  if (!(arg instanceof backend_pb.HistoryRequest)) {
    throw new Error('Expected argument of type create.HistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_HistoryRequest(buffer_arg) {
  return backend_pb.HistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_HistoryResponse(arg) {
  if (!(arg instanceof backend_pb.HistoryResponse)) {
    throw new Error('Expected argument of type create.HistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_HistoryResponse(buffer_arg) {
  return backend_pb.HistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_RedeemRequest(arg) {
  if (!(arg instanceof backend_pb.RedeemRequest)) {
    throw new Error('Expected argument of type create.RedeemRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_RedeemRequest(buffer_arg) {
  return backend_pb.RedeemRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_RedeemResponse(arg) {
  if (!(arg instanceof backend_pb.RedeemResponse)) {
    throw new Error('Expected argument of type create.RedeemResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_RedeemResponse(buffer_arg) {
  return backend_pb.RedeemResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_UpdateCreateRequest(arg) {
  if (!(arg instanceof backend_pb.UpdateCreateRequest)) {
    throw new Error('Expected argument of type create.UpdateCreateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_UpdateCreateRequest(buffer_arg) {
  return backend_pb.UpdateCreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_UpdateCreateResponse(arg) {
  if (!(arg instanceof backend_pb.UpdateCreateResponse)) {
    throw new Error('Expected argument of type create.UpdateCreateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_UpdateCreateResponse(buffer_arg) {
  return backend_pb.UpdateCreateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_UpdateRedeemedRequest(arg) {
  if (!(arg instanceof backend_pb.UpdateRedeemedRequest)) {
    throw new Error('Expected argument of type create.UpdateRedeemedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_UpdateRedeemedRequest(buffer_arg) {
  return backend_pb.UpdateRedeemedRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_create_UpdateRedeemedResponse(arg) {
  if (!(arg instanceof backend_pb.UpdateRedeemedResponse)) {
    throw new Error('Expected argument of type create.UpdateRedeemedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_create_UpdateRedeemedResponse(buffer_arg) {
  return backend_pb.UpdateRedeemedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var backendServiceService = exports.backendServiceService = {
  getTeam: {
    path: '/create.backendService/GetTeam',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.GetTeamRequest,
    responseType: backend_pb.GetTeamResponse,
    requestSerialize: serialize_create_GetTeamRequest,
    requestDeserialize: deserialize_create_GetTeamRequest,
    responseSerialize: serialize_create_GetTeamResponse,
    responseDeserialize: deserialize_create_GetTeamResponse,
  },
  getGifts: {
    path: '/create.backendService/GetGifts',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.GetGiftsRequest,
    responseType: backend_pb.GetGiftsResponse,
    requestSerialize: serialize_create_GetGiftsRequest,
    requestDeserialize: deserialize_create_GetGiftsRequest,
    responseSerialize: serialize_create_GetGiftsResponse,
    responseDeserialize: deserialize_create_GetGiftsResponse,
  },
  redeemGift: {
    path: '/create.backendService/RedeemGift',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.RedeemRequest,
    responseType: backend_pb.RedeemResponse,
    requestSerialize: serialize_create_RedeemRequest,
    requestDeserialize: deserialize_create_RedeemRequest,
    responseSerialize: serialize_create_RedeemResponse,
    responseDeserialize: deserialize_create_RedeemResponse,
  },
  checkHistory: {
    path: '/create.backendService/CheckHistory',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.HistoryRequest,
    responseType: backend_pb.HistoryResponse,
    requestSerialize: serialize_create_HistoryRequest,
    requestDeserialize: deserialize_create_HistoryRequest,
    responseSerialize: serialize_create_HistoryResponse,
    responseDeserialize: deserialize_create_HistoryResponse,
  },
  updateCreate: {
    path: '/create.backendService/UpdateCreate',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.UpdateCreateRequest,
    responseType: backend_pb.UpdateCreateResponse,
    requestSerialize: serialize_create_UpdateCreateRequest,
    requestDeserialize: deserialize_create_UpdateCreateRequest,
    responseSerialize: serialize_create_UpdateCreateResponse,
    responseDeserialize: deserialize_create_UpdateCreateResponse,
  },
  updateRedeemed: {
    path: '/create.backendService/UpdateRedeemed',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.UpdateRedeemedRequest,
    responseType: backend_pb.UpdateRedeemedResponse,
    requestSerialize: serialize_create_UpdateRedeemedRequest,
    requestDeserialize: deserialize_create_UpdateRedeemedRequest,
    responseSerialize: serialize_create_UpdateRedeemedResponse,
    responseDeserialize: deserialize_create_UpdateRedeemedResponse,
  },
};

exports.backendServiceClient = grpc.makeGenericClientConstructor(backendServiceService);
