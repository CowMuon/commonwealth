/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ICuratedProjectFactoryInterface extends ethers.utils.Interface {
  functions: {
    "addAcceptedTokens(address[])": FunctionFragment;
    "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)": FunctionFragment;
    "isAcceptedToken(address)": FunctionFragment;
    "numProjects()": FunctionFragment;
    "owner()": FunctionFragment;
    "projectImp()": FunctionFragment;
    "projects(uint32)": FunctionFragment;
    "protocolData()": FunctionFragment;
    "setAdmin(address)": FunctionFragment;
    "setCmnProjTokenImpl(address)": FunctionFragment;
    "setFeeTo(address)": FunctionFragment;
    "setPauseGuardian(address)": FunctionFragment;
    "setProjectImpl(address)": FunctionFragment;
    "setProtocolFee(uint8)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addAcceptedTokens",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "createProject",
    values: [
      BytesLike,
      BytesLike,
      BytesLike,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isAcceptedToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "numProjects",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "projectImp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "projects",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolData",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setCmnProjTokenImpl",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setFeeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setPauseGuardian",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setProjectImpl",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolFee",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addAcceptedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAcceptedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numProjects",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "projectImp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "projects", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCmnProjTokenImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFeeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPauseGuardian",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProjectImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolFee",
    data: BytesLike
  ): Result;

  events: {
    "ActionPaused(string,bool)": EventFragment;
    "NewAdmin(address,address)": EventFragment;
    "NewPauseGuardian(address,address)": EventFragment;
    "ProjectCreated(uint256,address)": EventFragment;
    "ProjectImplChange(address,address)": EventFragment;
    "ProtocolFeeChange(uint8,uint8)": EventFragment;
    "ProtocolFeeToChange(address,address)": EventFragment;
    "ProtocolTokenImplChange(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionPaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewPauseGuardian"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProjectCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProjectImplChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProtocolFeeChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProtocolFeeToChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProtocolTokenImplChange"): EventFragment;
}

export class ICuratedProjectFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ICuratedProjectFactoryInterface;

  functions: {
    addAcceptedTokens(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "addAcceptedTokens(address[])"(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createProject(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)"(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isAcceptedToken(
      token: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isAcceptedToken(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    numProjects(overrides?: CallOverrides): Promise<[number]>;

    "numProjects()"(overrides?: CallOverrides): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    projectImp(overrides?: CallOverrides): Promise<[string]>;

    "projectImp()"(overrides?: CallOverrides): Promise<[string]>;

    projects(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "projects(uint32)"(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    protocolData(
      overrides?: CallOverrides
    ): Promise<
      [
        [number, string, string, string] & {
          fee: number;
          feeTo: string;
          admin: string;
          pauseGuardian: string;
        }
      ]
    >;

    "protocolData()"(
      overrides?: CallOverrides
    ): Promise<
      [
        [number, string, string, string] & {
          fee: number;
          feeTo: string;
          admin: string;
          pauseGuardian: string;
        }
      ]
    >;

    setAdmin(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCmnProjTokenImpl(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setCmnProjTokenImpl(address)"(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setFeeTo(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPauseGuardian(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setPauseGuardian(address)"(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProjectImpl(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setProjectImpl(address)"(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProtocolFee(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setProtocolFee(uint8)"(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addAcceptedTokens(
    _tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "addAcceptedTokens(address[])"(
    _tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createProject(
    _name: BytesLike,
    _ipfsHash: BytesLike,
    _url: BytesLike,
    _beneficiary: string,
    _acceptedToken: string,
    _threshold: BigNumberish,
    _deadline: BigNumberish,
    _curatorFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)"(
    _name: BytesLike,
    _ipfsHash: BytesLike,
    _url: BytesLike,
    _beneficiary: string,
    _acceptedToken: string,
    _threshold: BigNumberish,
    _deadline: BigNumberish,
    _curatorFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isAcceptedToken(token: string, overrides?: CallOverrides): Promise<boolean>;

  "isAcceptedToken(address)"(
    token: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  numProjects(overrides?: CallOverrides): Promise<number>;

  "numProjects()"(overrides?: CallOverrides): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  projectImp(overrides?: CallOverrides): Promise<string>;

  "projectImp()"(overrides?: CallOverrides): Promise<string>;

  projects(
    projectIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "projects(uint32)"(
    projectIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  protocolData(
    overrides?: CallOverrides
  ): Promise<
    [number, string, string, string] & {
      fee: number;
      feeTo: string;
      admin: string;
      pauseGuardian: string;
    }
  >;

  "protocolData()"(
    overrides?: CallOverrides
  ): Promise<
    [number, string, string, string] & {
      fee: number;
      feeTo: string;
      admin: string;
      pauseGuardian: string;
    }
  >;

  setAdmin(
    newAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setAdmin(address)"(
    newAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCmnProjTokenImpl(
    _cmnProjTokenImpl: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setCmnProjTokenImpl(address)"(
    _cmnProjTokenImpl: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setFeeTo(
    _feeTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setFeeTo(address)"(
    _feeTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPauseGuardian(
    newPauseGuardian: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setPauseGuardian(address)"(
    newPauseGuardian: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProjectImpl(
    _projectImpl: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setProjectImpl(address)"(
    _projectImpl: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProtocolFee(
    _protocolFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setProtocolFee(uint8)"(
    _protocolFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addAcceptedTokens(
      _tokens: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    "addAcceptedTokens(address[])"(
      _tokens: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    createProject(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)"(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isAcceptedToken(token: string, overrides?: CallOverrides): Promise<boolean>;

    "isAcceptedToken(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    numProjects(overrides?: CallOverrides): Promise<number>;

    "numProjects()"(overrides?: CallOverrides): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    projectImp(overrides?: CallOverrides): Promise<string>;

    "projectImp()"(overrides?: CallOverrides): Promise<string>;

    projects(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "projects(uint32)"(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    protocolData(
      overrides?: CallOverrides
    ): Promise<
      [number, string, string, string] & {
        fee: number;
        feeTo: string;
        admin: string;
        pauseGuardian: string;
      }
    >;

    "protocolData()"(
      overrides?: CallOverrides
    ): Promise<
      [number, string, string, string] & {
        fee: number;
        feeTo: string;
        admin: string;
        pauseGuardian: string;
      }
    >;

    setAdmin(newAdmin: string, overrides?: CallOverrides): Promise<void>;

    "setAdmin(address)"(
      newAdmin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setCmnProjTokenImpl(
      _cmnProjTokenImpl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setCmnProjTokenImpl(address)"(
      _cmnProjTokenImpl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeeTo(_feeTo: string, overrides?: CallOverrides): Promise<void>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPauseGuardian(
      newPauseGuardian: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setPauseGuardian(address)"(
      newPauseGuardian: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setProjectImpl(
      _projectImpl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setProjectImpl(address)"(
      _projectImpl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setProtocolFee(
      _protocolFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setProtocolFee(uint8)"(
      _protocolFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ActionPaused(
      action: null,
      pauseState: null
    ): TypedEventFilter<
      [string, boolean],
      { action: string; pauseState: boolean }
    >;

    NewAdmin(
      oldAdmin: null,
      newAdmin: null
    ): TypedEventFilter<
      [string, string],
      { oldAdmin: string; newAdmin: string }
    >;

    NewPauseGuardian(
      oldPauseGuardian: null,
      newPauseGuardian: null
    ): TypedEventFilter<
      [string, string],
      { oldPauseGuardian: string; newPauseGuardian: string }
    >;

    ProjectCreated(
      projectIndex: null,
      projectAddress: null
    ): TypedEventFilter<
      [BigNumber, string],
      { projectIndex: BigNumber; projectAddress: string }
    >;

    ProjectImplChange(
      oldAddr: null,
      newAddr: null
    ): TypedEventFilter<[string, string], { oldAddr: string; newAddr: string }>;

    ProtocolFeeChange(
      oldFee: null,
      newFee: null
    ): TypedEventFilter<[number, number], { oldFee: number; newFee: number }>;

    ProtocolFeeToChange(
      oldAddr: null,
      newAddr: null
    ): TypedEventFilter<[string, string], { oldAddr: string; newAddr: string }>;

    ProtocolTokenImplChange(
      oldAddr: null,
      newAddr: null
    ): TypedEventFilter<[string, string], { oldAddr: string; newAddr: string }>;
  };

  estimateGas: {
    addAcceptedTokens(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "addAcceptedTokens(address[])"(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createProject(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)"(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isAcceptedToken(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isAcceptedToken(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    numProjects(overrides?: CallOverrides): Promise<BigNumber>;

    "numProjects()"(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    projectImp(overrides?: CallOverrides): Promise<BigNumber>;

    "projectImp()"(overrides?: CallOverrides): Promise<BigNumber>;

    projects(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "projects(uint32)"(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    protocolData(overrides?: CallOverrides): Promise<BigNumber>;

    "protocolData()"(overrides?: CallOverrides): Promise<BigNumber>;

    setAdmin(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCmnProjTokenImpl(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setCmnProjTokenImpl(address)"(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setFeeTo(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPauseGuardian(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setPauseGuardian(address)"(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProjectImpl(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setProjectImpl(address)"(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProtocolFee(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setProtocolFee(uint8)"(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addAcceptedTokens(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "addAcceptedTokens(address[])"(
      _tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createProject(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createProject(bytes32,bytes32,bytes32,address,address,uint256,uint256,uint8)"(
      _name: BytesLike,
      _ipfsHash: BytesLike,
      _url: BytesLike,
      _beneficiary: string,
      _acceptedToken: string,
      _threshold: BigNumberish,
      _deadline: BigNumberish,
      _curatorFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isAcceptedToken(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isAcceptedToken(address)"(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numProjects(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "numProjects()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    projectImp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "projectImp()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    projects(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "projects(uint32)"(
      projectIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    protocolData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "protocolData()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setAdmin(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setAdmin(address)"(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCmnProjTokenImpl(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setCmnProjTokenImpl(address)"(
      _cmnProjTokenImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setFeeTo(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setFeeTo(address)"(
      _feeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPauseGuardian(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setPauseGuardian(address)"(
      newPauseGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProjectImpl(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setProjectImpl(address)"(
      _projectImpl: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProtocolFee(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setProtocolFee(uint8)"(
      _protocolFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
