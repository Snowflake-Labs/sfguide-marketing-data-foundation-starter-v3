
export interface AssistantInfo {
    id: string,
    name: string,
    chat: string[],
    type: string,
}

export interface NewAssistantInfo {
    NAME: string;
    TYPE: "CortexCopilot" | "DataEngineering";
}
  