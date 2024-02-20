// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var backend_pb = require('./backend_pb.js');

function serialize_backend_GetGiftRequest(arg) {
  if (!(arg instanceof backend_pb.GetGiftRequest)) {
    throw new Error('Expected argument of type backend.GetGiftRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_backend_GetGiftRequest(buffer_arg) {
  return backend_pb.GetGiftRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_backend_GetGiftResponse(arg) {
  if (!(arg instanceof backend_pb.GetGiftResponse)) {
    throw new Error('Expected argument of type backend.GetGiftResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_backend_GetGiftResponse(buffer_arg) {
  return backend_pb.GetGiftResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_backend_GetTeamRequest(arg) {
  if (!(arg instanceof backend_pb.GetTeamRequest)) {
    throw new Error('Expected argument of type backend.GetTeamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_backend_GetTeamRequest(buffer_arg) {
  return backend_pb.GetTeamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_backend_GetTeamResponse(arg) {
  if (!(arg instanceof backend_pb.GetTeamResponse)) {
    throw new Error('Expected argument of type backend.GetTeamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_backend_GetTeamResponse(buffer_arg) {
  return backend_pb.GetTeamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var backendServiceService = exports.backendServiceService = {
  getTeam: {
    path: '/backend.backendService/GetTeam',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.GetTeamRequest,
    responseType: backend_pb.GetTeamResponse,
    requestSerialize: serialize_backend_GetTeamRequest,
    requestDeserialize: deserialize_backend_GetTeamRequest,
    responseSerialize: serialize_backend_GetTeamResponse,
    responseDeserialize: deserialize_backend_GetTeamResponse,
  },
  getGift: {
    path: '/backend.backendService/GetGift',
    requestStream: false,
    responseStream: false,
    requestType: backend_pb.GetGiftRequest,
    responseType: backend_pb.GetGiftResponse,
    requestSerialize: serialize_backend_GetGiftRequest,
    requestDeserialize: deserialize_backend_GetGiftRequest,
    responseSerialize: serialize_backend_GetGiftResponse,
    responseDeserialize: deserialize_backend_GetGiftResponse,
  },
};

exports.backendServiceClient = grpc.makeGenericClientConstructor(backendServiceService);
