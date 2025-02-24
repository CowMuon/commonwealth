/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { ICuratedProject } from "../ICuratedProject";

export class ICuratedProject__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICuratedProject {
    return new Contract(address, _abi, signerOrProvider) as ICuratedProject;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Back",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Curate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Failed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "oldData",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "newData",
        type: "bytes32",
      },
    ],
    name: "ProjectDataChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Succeeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "withdrawalType",
        type: "bytes32",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "bToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "back",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "backersWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiaryWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "curate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "curatorFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "curatorsWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "funded",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "ipfsHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "url",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectMetaData",
        name: "_metaData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "acceptedToken",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectData",
        name: "_projectData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "fee",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "feeTo",
            type: "address",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "address",
            name: "pauseGuardian",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProtocolData",
        name: "_protocolData",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "_curatorFee",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_bToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_cToken",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockedWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "metaData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "ipfsHash",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "url",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectMetaData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "address",
            name: "acceptedToken",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProjectData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolData",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "fee",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "feeTo",
            type: "address",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "address",
            name: "pauseGuardian",
            type: "address",
          },
        ],
        internalType: "struct DataTypes.ProtocolData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_ipfsHash",
        type: "bytes32",
      },
    ],
    name: "setIpfsHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_url",
        type: "bytes32",
      },
    ],
    name: "setUrl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCuratorFunding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalFunding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawRemaining",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
