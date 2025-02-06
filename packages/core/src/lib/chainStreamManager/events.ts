import { Config, Message, ToolCall } from '@latitude-data/compiler'
import {
  ChainStepResponse,
  ProviderData,
  StreamEventTypes,
  StreamType,
} from '@latitude-data/constants'
import { FinishReason, LanguageModelUsage } from 'ai'

export enum ChainEventTypes {
  ChainStarted = 'chain-started',
  StepStarted = 'step-started',
  ProviderStarted = 'provider-started',
  ProviderCompleted = 'provider-completed',
  ToolsStarted = 'tools-started',
  ToolCompleted = 'tool-completed',
  StepCompleted = 'step-completed',
  ChainCompleted = 'chain-completed',
  ChainError = 'chain-error',
  ToolsRequested = 'tools-requested',
}

interface GenericLatitudeEventData {
  type: ChainEventTypes
  messages: Message[]
  documentLogUuid: string
}

export interface LatitudeChainStartedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ChainStarted
}

export interface LatitudeStepStartedEventData extends GenericLatitudeEventData {
  type: ChainEventTypes.StepStarted
}

export interface LatitudeProviderStartedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ProviderStarted
  config: Config
}

export interface LatitudeProviderCompletedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ProviderCompleted
  providerLogUuid: string
  tokenUsage: LanguageModelUsage
  finishReason: FinishReason
  response: ChainStepResponse<StreamType>
}

export interface LatitudeToolsStartedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ToolsStarted
  tools: ToolCall[]
}

export interface LatitudeToolCompletedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ToolCompleted
}

export interface LatitudeStepCompletedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.StepCompleted
}

export interface LatitudeChainCompletedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ChainCompleted
  tokenUsage: LanguageModelUsage
  finishReason: FinishReason
}

export interface LatitudeChainErrorEventData extends GenericLatitudeEventData {
  type: ChainEventTypes.ChainError
  error: Error
}

export interface LatitudeToolsRequestedEventData
  extends GenericLatitudeEventData {
  type: ChainEventTypes.ToolsRequested
  tools: ToolCall[]
}

export type LatitudeEventData =
  | LatitudeChainStartedEventData
  | LatitudeStepStartedEventData
  | LatitudeProviderStartedEventData
  | LatitudeProviderCompletedEventData
  | LatitudeToolsStartedEventData
  | LatitudeToolCompletedEventData
  | LatitudeStepCompletedEventData
  | LatitudeChainCompletedEventData
  | LatitudeChainErrorEventData
  | LatitudeToolsRequestedEventData

// Just a type helper for ChainStreamManager. Omit<LatitudeEventData, 'messages' | 'documentLogUuid'> does not work.
export type OmittedLatitudeEventData =
  | Omit<LatitudeChainStartedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeStepStartedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeProviderStartedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeProviderCompletedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeToolsStartedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeToolCompletedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeStepCompletedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeChainCompletedEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeChainErrorEventData, 'messages' | 'documentLogUuid'>
  | Omit<LatitudeToolsRequestedEventData, 'messages' | 'documentLogUuid'>

export type ChainEvent =
  | {
      event: StreamEventTypes.Latitude
      data: LatitudeEventData
    }
  | {
      event: StreamEventTypes.Provider
      data: ProviderData
    }
